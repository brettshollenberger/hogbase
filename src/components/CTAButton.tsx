import * as React from "react";
import { Button as BaseButton, ButtonProps } from "@/components/ui/button";
import { trackCTAClick } from '../utils/analytics';

export const TrackedButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (props, ref) => {
    const { onClick, children, ...restProps } = props;
    
    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        // Extract button text
        let buttonText = "";
        
        // Handle different types of children to extract text
        if (typeof children === "string") {
          buttonText = children;
        } else if (React.isValidElement(children)) {
          // If children is a React element, try to extract text content
          const childrenArray = React.Children.toArray(children);
          buttonText = childrenArray
            .map(child => {
              if (typeof child === "string") return child;
              if (typeof child === "number") return String(child);
              return "";
            })
            .join(" ")
            .trim();
        }
        
        // Track the click with the button text
        trackCTAClick(buttonText || "Unknown");
        
        // Call the original onClick if it exists
        if (onClick) {
          onClick(event);
        }
      },
      [onClick, children]
    );
    
    return (
      <BaseButton
        ref={ref}
        onClick={handleClick}
        {...restProps}
      >
        {children}
      </BaseButton>
    );
  }
);

TrackedButton.displayName = "TrackedButton";