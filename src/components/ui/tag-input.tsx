"use client";

import { useId, useState, type KeyboardEvent } from "react";
import { X } from "lucide-react";
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
import { SortableContext, useSortable, arrayMove, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Badge } from "@/components/ui/badge";

/**
 * One draggable tag. The whole badge is the drag handle (compact tags have
 * no room to spare for a separate grip icon) — the remove button stops
 * pointer-down from propagating so clicking it removes the tag instead of
 * starting a drag.
 */
function SortableTag({ tag, onRemove }: { tag: string; onRemove: () => void }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: tag });

  return (
    <Badge
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      variant="secondary"
      className="h-auto max-w-full min-w-0 shrink cursor-grab touch-none gap-1 overflow-visible py-1 pr-1 whitespace-normal wrap-break-word active:cursor-grabbing"
      {...attributes}
      {...listeners}
    >
      {tag}
      <button
        type="button"
        onClick={onRemove}
        onPointerDown={(event) => event.stopPropagation()}
        aria-label={`Retirer ${tag}`}
        className="rounded-full hover:bg-foreground/10"
      >
        <X className="size-3" aria-hidden="true" />
      </button>
    </Badge>
  );
}

export function TagInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");
  // dnd-kit auto-generates ids for its accessibility announcements using an
  // internal counter that isn't SSR-safe on its own (server and client can
  // mount DndContext instances in different orders/counts) — React's useId
  // is specifically designed to produce the same value on both, so passing
  // it through avoids a real hydration mismatch warning here.
  const dndId = useId();
  // A short activation distance keeps a plain click (e.g. on the remove
  // button, or just to focus the input) from being mistaken for a drag.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const commit = () => {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft("");
  };

  const onKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      commit();
    } else if (event.key === "Backspace" && draft === "" && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = value.indexOf(String(active.id));
    const newIndex = value.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    onChange(arrayMove(value, oldIndex, newIndex));
  };

  return (
    <div className="flex flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-2 py-1.5 focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
      <DndContext id={dndId} sensors={sensors} collisionDetection={closestCenter} onDragEnd={onDragEnd}>
        <SortableContext items={value} strategy={rectSortingStrategy}>
          {value.map((tag, index) => (
            <SortableTag
              key={tag}
              tag={tag}
              onRemove={() => onChange(value.filter((_, i) => i !== index))}
            />
          ))}
        </SortableContext>
      </DndContext>
      <input
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={onKeyDown}
        onBlur={commit}
        placeholder={value.length === 0 ? placeholder : undefined}
        className="min-w-[8rem] flex-1 bg-transparent py-0.5 text-sm outline-none placeholder:text-muted-foreground"
      />
    </div>
  );
}
