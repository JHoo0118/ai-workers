import type { Active, UniqueIdentifier } from "@dnd-kit/core";
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import type { ReactNode } from "react";
import { useMemo, useState } from "react";

import { DragHandle, SortableItem, SortableOverlay } from "./components";

interface BaseItem {
  id: UniqueIdentifier;
}

interface Props<T extends BaseItem> {
  items: T[];
  onChange(items: T[]): void;
  renderItem(item: T): ReactNode;
  renderDragItem?(item: T): ReactNode;
}

export function SortableList<T extends BaseItem>({
  items,
  onChange,
  renderItem,
  renderDragItem,
}: Props<T>) {
  const [active, setActive] = useState<Active | null>(null);
  const activeItem = useMemo(
    () => items.find((item) => item.id === active?.id),
    [active, items],
  );
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  return (
    <DndContext
      sensors={sensors}
      onDragStart={({ active }) => {
        setActive(active);
      }}
      onDragEnd={({ active, over }) => {
        if (over && active.id !== over?.id) {
          const activeIndex = items.findIndex(({ id }) => id === active.id);
          const overIndex = items.findIndex(({ id }) => id === over.id);

          onChange(arrayMove(items, activeIndex, overIndex));
        }
        setActive(null);
      }}
      onDragCancel={() => {
        setActive(null);
      }}
    >
      <SortableContext items={items}>
        <div className="relative flex w-full flex-wrap justify-center gap-4 p-20">
          {/* <div className="absolute right-0 top-0">123</div> */}
          {items.map((item) => (
            <div
              className="mb-4 w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/6"
              key={item.id}
            >
              {renderItem(item)}
            </div>
          ))}
        </div>
        <SortableOverlay>
          {activeItem
            ? renderDragItem
              ? renderDragItem(activeItem)
              : renderItem(activeItem)
            : null}
        </SortableOverlay>
      </SortableContext>
    </DndContext>
  );
}

SortableList.Item = SortableItem;
SortableList.DragHandle = DragHandle;
