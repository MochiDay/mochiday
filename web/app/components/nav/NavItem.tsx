export function NavItem({
  name,
  isActive,
  activeIcon,
  icon,
  activeBgColor,
}: {
  name: string;
  isActive: boolean;
  activeIcon: JSX.Element;
  icon: JSX.Element;
  activeBgColor?: string;
}) {
  return (
    <div
      className={`flex flex-row items-center w-full cursor-pointer my-1  
    ${isActive ? activeBgColor ?? "bg-black" : "hover:bg-black/20"}
  `}
      style={{
        padding: "10px",
        borderRadius: "10px",
      }}
    >
      <div className={`mr-2 ${isActive ? "text-white" : ""}`}>
        {isActive ? activeIcon : icon}
      </div>
      <span className={`${isActive ? "text-white" : ""}`}>{name}</span>
    </div>
  );
}
