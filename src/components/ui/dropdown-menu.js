import React, { useState, useRef, useEffect } from 'react';

export const DropdownMenu = ({ children }) => {
  return <div className="relative">{children}</div>;
};

export const DropdownMenuTrigger = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export const DropdownMenuContent = ({ 
  children, 
  align = 'start', 
  className = '' 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Find the trigger element and manage its click handler
  useEffect(() => {
    const triggerElement = dropdownRef.current?.previousSibling;
    if (triggerElement) {
      const handleTriggerClick = () => {
        setIsOpen(!isOpen);
      };
      
      triggerElement.addEventListener('click', handleTriggerClick);
      return () => {
        triggerElement.removeEventListener('click', handleTriggerClick);
      };
    }
  }, [isOpen]);

  const alignmentClasses = {
    start: 'left-0',
    center: 'left-1/2 transform -translate-x-1/2',
    end: 'right-0'
  };

  return (
    <>
      {isOpen && (
        <div
          ref={dropdownRef}
          className={`absolute z-50 mt-2 min-w-[8rem] overflow-hidden rounded-md border bg-white p-1 text-gray-950 shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 ${alignmentClasses[align]} ${className}`}
        >
          {children}
        </div>
      )}
    </>
  );
};

export const DropdownMenuItem = ({ 
  children, 
  onClick, 
  className = '',
  disabled = false 
}) => {
  return (
    <div
      className={`relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-gray-100 focus:text-gray-900 data-[disabled]:pointer-events-none data-[disabled]:opacity-50 ${disabled ? 'pointer-events-none opacity-50' : 'hover:bg-gray-100 hover:text-gray-900'} ${className}`}
      onClick={disabled ? undefined : onClick}
      tabIndex={disabled ? -1 : 0}
    >
      {children}
    </div>
  );
};

export const DropdownMenuLabel = ({ children, className = '' }) => {
  return (
    <div className={`px-2 py-1.5 text-sm font-semibold ${className}`}>
      {children}
    </div>
  );
};

export const DropdownMenuSeparator = ({ className = '' }) => {
  return <div className={`-mx-1 my-1 h-px bg-gray-200 ${className}`} />;
};

export const DropdownMenuGroup = ({ children, className = '' }) => {
  return <div className={className}>{children}</div>;
};

export const DropdownMenuShortcut = ({ 
  children, 
  className = '' 
}) => {
  return (
    <span className={`ml-auto text-xs tracking-widest opacity-60 ${className}`}>
      {children}
    </span>
  );
};