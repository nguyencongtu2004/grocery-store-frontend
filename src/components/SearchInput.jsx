import { Input, Button } from "@nextui-org/react";
import { SearchIcon } from "lucide-react";
import PropTypes from "prop-types";

export default function SearchInput({ 
  value, 
  onValueChange, 
  onSearch, 
  placeholder = "Search...", 
  isLoading = false,
  className = "",
  inputClassName = "",
}) {
  return (
    <div className={`flex gap-4 mb-4 ${className}`}>
      <Input
        isClearable
        radius="lg"
        classNames={{
          label: "text-black/50 dark:text-white/90",
          input: [
            "bg-transparent",
            "text-black/90 dark:text-white/90",
            "placeholder:text-default-700/50 dark:placeholder:text-white/60",
            inputClassName
          ],
          innerWrapper: "bg-transparent",
          inputWrapper: [
            "bg-default-200/50",
            "dark:bg-default/60",
            "backdrop-blur-none",
            "backdrop-saturate-200",
            "hover:bg-default-200/70",
            "dark:hover:bg-default/70",
            "group-data-[focused=true]:bg-default-200/50",
            "dark:group-data-[focused=true]:bg-default/60",
            "!cursor-text",
            "border",
          ],
        }}
        placeholder={placeholder}
        startContent={
          <SearchIcon className="text-black/50 mb-0.5 dark:text-white/90 text-slate-400 pointer-events-none flex-shrink-0" />
        }
        value={value}
        onValueChange={onValueChange}
        onClear={() => onValueChange("")}
      />
      <Button 
        color="primary" 
        variant="solid" 
        onClick={onSearch}
        isLoading={isLoading}
      >
        Search
      </Button>
    </div>
  );
}

SearchInput.propTypes = {
  value: PropTypes.string,
  onValueChange: PropTypes.func,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  isLoading: PropTypes.bool,
  className: PropTypes.string,
  inputClassName: PropTypes.string,
};