import { AnimationEvent, MouseEvent, ReactNode, Ref, forwardRef } from 'react';

import { Icon, IconName, NotificationButton } from '@proton/components/components';

import { classnames } from '../../helpers';
import { NotificationType } from './interfaces';

const TYPES_CLASS = {
    error: 'notification--error',
    warning: 'notification--warning',
    info: 'notification--info',
    success: 'notification--success',
};

const CLASSES = {
    NOTIFICATION: 'notification',
    NOTIFICATION_IN: 'notification--in',
    NOTIFICATION_OUT: 'notification--out',
};

const ANIMATIONS = {
    NOTIFICATION_IN: 'anime-notification-in',
    NOTIFICATION_OUT: 'anime-notification-out',
};

interface Props {
    children: ReactNode;
    type: NotificationType;
    isClosing: boolean;
    onExit: () => void;
    onClick?: (e: MouseEvent<HTMLElement>) => void;
    onClose?: () => void;
    icon?: IconName;
    top: number | undefined;
}

const NotificationBase = (
    { children, type, top, isClosing, onClick, onClose, onExit, icon }: Props,
    ref: Ref<HTMLDivElement>
) => {
    const handleAnimationEnd = ({ animationName }: AnimationEvent<HTMLDivElement>) => {
        if (animationName === ANIMATIONS.NOTIFICATION_OUT && isClosing) {
            onExit();
        }
    };

    return (
        <div
            ref={ref}
            aria-atomic="true"
            role="alert"
            className={classnames([
                CLASSES.NOTIFICATION,
                CLASSES.NOTIFICATION_IN,
                TYPES_CLASS[type] || TYPES_CLASS.success,
                isClosing && CLASSES.NOTIFICATION_OUT,
            ])}
            onClick={onClick}
            onAnimationEnd={handleAnimationEnd}
            style={{
                '--top-custom': top === undefined ? `${-999}px` : `${top}px`,
            }}
        >
            {icon && <Icon name={icon} className="notification__icon" />}
            <span className="notification__content">{children}</span>
            {onClose && (
                <NotificationButton
                    notificationType={type == 'error' || type == 'warning' ? 'warning' : undefined}
                    icon
                    onClick={onClose}
                    className="notification__close-button"
                >
                    <Icon name="cross" />
                </NotificationButton>
            )}
        </div>
    );
};

const Notification = forwardRef<HTMLDivElement, Props>(NotificationBase);

export default Notification;
