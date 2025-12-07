/**
 * ControlButton Component (Molecule)
 * Media control button with icon switching
 */
import React from 'react'
import IconButton from '../atoms/IconButton';

export default function ControlButton({
    icon: Icon,
    activeIcon: ActiveIcon,
    isActive,
    onClick,
    danger = false,
    tooltip,
    activeTooltip,
}) {
    const currentIcon = isActive && ActiveIcon ? ActiveIcon : Icon;
    const currentTooltip = isActive && activeTooltip ? activeTooltip : tooltip;

    return (
        <IconButton
            icon={currentIcon}
            onClick={onClick}
            active={isActive}
            danger={danger}
            tooltip={currentTooltip}
        />
    );
}
