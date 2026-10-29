"use client";

import { useId } from "react";
import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import { GripVertical, Plus, Trash2 } from "lucide-react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  TouchSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { Control, UseFormRegister } from "react-hook-form";
import type { CvFormValues } from "@/lib/cv/form-values";
import { emptyExperience } from "@/lib/cv/form-values";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TagInput } from "@/components/ui/tag-input";

function SortableExperience({
  id,
  index,
  showSeparator,
  control,
  register,
  onRemove,
}: {
  id: string;
  index: number;
  showSeparator: boolean;
  control: Control<CvFormValues>;
  register: UseFormRegister<CvFormValues>;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className="space-y-4"
    >
      {showSeparator && <Separator />}
      <div className="flex items-start gap-2">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="mt-2.5 shrink-0 cursor-grab touch-none text-muted-foreground hover:text-foreground active:cursor-grabbing"
          aria-label="Réorganiser cette expérience"
        >
          <GripVertical className="size-4" aria-hidden="true" />
        </button>

        <div className="flex flex-1 items-start justify-between gap-4">
          <div className="grid flex-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor={`experiences.${index}.jobTitle`}>Poste</Label>
              <Input id={`experiences.${index}.jobTitle`} {...register(`experiences.${index}.jobTitle`)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`experiences.${index}.company`}>Entreprise</Label>
              <Input id={`experiences.${index}.company`} {...register(`experiences.${index}.company`)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`experiences.${index}.location`}>Localisation</Label>
              <Input id={`experiences.${index}.location`} {...register(`experiences.${index}.location`)} />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-2">
                <Label htmlFor={`experiences.${index}.startDate`}>Début</Label>
                <Input id={`experiences.${index}.startDate`} {...register(`experiences.${index}.startDate`)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`experiences.${index}.endDate`}>Fin</Label>
                <Input id={`experiences.${index}.endDate`} {...register(`experiences.${index}.endDate`)} />
              </div>
            </div>
          </div>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove} aria-label="Supprimer cette expérience">
            <Trash2 className="size-4" aria-hidden="true" />
          </Button>
        </div>
      </div>

      <label className="flex items-center gap-2 pl-6 text-sm">
        <input type="checkbox" className="size-4 rounded border-input" {...register(`experiences.${index}.current`)} />
        Poste actuel
      </label>

      <div className="space-y-2 pl-6">
        <Label htmlFor={`experiences.${index}.description`}>Description</Label>
        <Textarea id={`experiences.${index}.description`} rows={3} {...register(`experiences.${index}.description`)} />
      </div>

      <div className="grid gap-4 pl-6 sm:grid-cols-2">
        <div className="min-w-0 space-y-2">
          <Label>Réalisations</Label>
          <Controller
            control={control}
            name={`experiences.${index}.achievements`}
            render={({ field: f }) => <TagInput value={f.value} onChange={f.onChange} placeholder="Ajouter une réalisation" />}
          />
        </div>
        <div className="min-w-0 space-y-2">
          <Label>Technologies</Label>
          <Controller
            control={control}
            name={`experiences.${index}.technologies`}
            render={({ field: f }) => <TagInput value={f.value} onChange={f.onChange} placeholder="Ajouter une technologie" />}
          />
        </div>
      </div>
    </div>
  );
}

export function ExperienceSection() {
  const { register, control } = useFormContext<CvFormValues>();
  const { fields, append, remove, move } = useFieldArray({ control, name: "experiences" });
  // See src/components/ui/tag-input.tsx for why useId is needed here (SSR-safe dnd-kit accessibility ids).
  const dndId = useId();
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = fields.findIndex((field) => field.id === active.id);
    const newIndex = fields.findIndex((field) => field.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    move(oldIndex, newIndex);
  };

  return (
    <div className="space-y-6">
      <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={fields.map((field) => field.id)} strategy={verticalListSortingStrategy}>
          {fields.map((field, index) => (
            <SortableExperience
              key={field.id}
              id={field.id}
              index={index}
              showSeparator={index > 0}
              control={control}
              register={register}
              onRemove={() => remove(index)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <Button type="button" variant="outline" size="sm" onClick={() => append(emptyExperience())}>
        <Plus className="size-4" aria-hidden="true" />
        Ajouter une expérience
      </Button>
    </div>
  );
}
