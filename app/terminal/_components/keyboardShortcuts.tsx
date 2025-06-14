import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Keyboard, X } from "lucide-react";

export default function KeyboardShortcuts() {
  const shortcuts = [
    { keys: "Alt + 1", label: "Toggle Bill Nav" },
    { keys: "Alt + 2", label: "Categories Tab" },
    { keys: "Alt + 3", label: "Ready-Made Tab" },
    { keys: "Alt + 4", label: "Custom/Service Tab" },
    { keys: "Alt + D", label: "Enter Discount" },
    { keys: "Alt + A", label: "Enter Amount" },
    { keys: "Alt + V", label: "Toggle VAT" },
    { keys: `Alt + K`, label: "Search products" },
    { keys: `Alt + Enter`, label: "Complete order" },
    { keys: `Alt + H`, label: "Hold order" },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" title="Keyboard Shortcuts">
          <Keyboard className="h-5 w-5" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        side="bottom" // drop it below the trigger
        align="start" // left-align to the trigger
        sideOffset={8} // 8px of breathing room vertically
        alignOffset={0} // no horizontal offset
        className="w-64 p-4"
      >
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-semibold">Shortcuts</h4>
        </div>
        <ul className="space-y-1">
          {shortcuts.map((sc) => (
            <li key={sc.keys} className="flex justify-between">
              <code className="bg-gray-100 px-1 rounded text-sm">
                {sc.keys}
              </code>
              <span className="text-sm">{sc.label}</span>
            </li>
          ))}
        </ul>
      </PopoverContent>
    </Popover>
  );
}
