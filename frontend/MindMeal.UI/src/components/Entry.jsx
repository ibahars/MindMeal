import * as LucideIcons from "lucide-react";

const Entry = ({
  iconName = "Search",
  placeholder = "Bir şeyler yazın...",
  type = "text",
  value,
  onChange,
  className = "",
}) => {
  const IconComponent = LucideIcons[iconName];

  if (!IconComponent) {
    console.error(`Lucide icon "${iconName}" not found.`);
    return null;
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <IconComponent className="h-4 w-4 text-gray-900" />{" "}
      </div>

      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full bg-white text-black-700 placeholder:text-black-700 border border-gray-200 rounded-[25px] pl-9 pr-3 py-1.5 text-sm focus:ring-1 focus:ring-orange-300 focus:border-orange-300 outline-none transition-all duration-200 shadow-sm"
      />
    </div>
  );
};

export default Entry;
