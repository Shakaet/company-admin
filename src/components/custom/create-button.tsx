import { Plus } from "lucide-react";
import { Button } from "../ui/button";

const CreateButton = ({
  label = "Create",
  onClick,
  className = "",
}: {
  label?: string;
  onClick: () => void;
  className?: string;
}) => {
  return (
    <Button
      type="button"
      onClick={onClick}
      className={`gap-2 shrink-0 whitespace-nowrap ${className}`}
    >
      <Plus className="h-4 w-4" />
      {label}
    </Button>
  );
};

export default CreateButton;
