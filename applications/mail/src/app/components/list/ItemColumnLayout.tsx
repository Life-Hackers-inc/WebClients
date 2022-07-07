import { useMemo } from 'react';
import { c, msgid } from 'ttag';
import { Label } from '@proton/shared/lib/interfaces/Label';
import { getHasOnlyIcsAttachments } from '@proton/shared/lib/mail/messages';
import ItemStar from './ItemStar';
import ItemLabels from './ItemLabels';
import ItemAttachmentIcon from './ItemAttachmentIcon';
import ItemLocation from './ItemLocation';
import ItemDate from './ItemDate';
import NumMessages from '../conversation/NumMessages';
import { Element } from '../../models/element';
import ItemExpiration from './ItemExpiration';
import ItemAction from './ItemAction';
import { Breakpoints } from '../../models/utils';
import { ESMessage } from '../../models/encryptedSearch';
import { useEncryptedSearchContext } from '../../containers/EncryptedSearchProvider';

interface Props {
    labelID: string;
    labels?: Label[];
    element: Element;
    conversationMode: boolean;
    showIcon: boolean;
    senders: string;
    addresses: string;
    displayRecipients: boolean;
    loading: boolean;
    breakpoints: Breakpoints;
    unread: boolean;
}

const ItemColumnLayout = ({
    labelID,
    labels,
    element,
    conversationMode,
    showIcon,
    senders,
    addresses,
    displayRecipients,
    loading,
    breakpoints,
    unread,
}: Props) => {
    const { shouldHighlight, highlightMetadata } = useEncryptedSearchContext();
    const highlightData = shouldHighlight();

    const body = (element as ESMessage).decryptedBody;
    const { Subject } = element;

    const sendersContent = useMemo(
        () =>
            !loading && displayRecipients && !senders
                ? c('Info').t`(No Recipient)`
                : highlightData
                ? highlightMetadata(senders, unread, true).resultJSX
                : senders,
        [loading, displayRecipients, senders, highlightData]
    );
    const subjectContent = useMemo(
        () => (highlightData && Subject ? highlightMetadata(Subject, unread, true).resultJSX : Subject),
        [Subject, highlightData]
    );

    const { resultJSX, numOccurrences } = useMemo(
        () =>
            body && highlightData ? highlightMetadata(body, unread, true) : { resultJSX: undefined, numOccurrences: 0 },
        [body, unread]
    );
    const bodyTitle = c('Info').ngettext(
        msgid`${numOccurrences} occurrence found in the mail content`,
        `${numOccurrences} occurrences found in the mail content`,
        numOccurrences
    );

    const hasOnlyIcsAttachments = getHasOnlyIcsAttachments(element?.AttachmentInfo);

    return (
        <div
            className="flex-item-fluid flex flex-nowrap flex-column flex-justify-center item-titlesender"
            data-testid="message-list:message"
        >
            <div className="flex flex-align-items-center item-firstline">
                <div className="item-senders flex-item-fluid flex flex-nowrap pr1">
                    <span
                        className="inline-block max-w100 text-ellipsis"
                        title={addresses}
                        data-testid="message-column:sender-address"
                    >
                        {sendersContent}
                    </span>
                    <ItemAction element={element} className="ml0-5 flex-item-noshrink mtauto mbauto" />
                </div>

                {!!element.ExpirationTime && (
                    <span className="flex-item-noshrink">
                        <ItemExpiration element={element} className="mr0-5" />
                    </span>
                )}

                <ItemDate element={element} labelID={labelID} className="item-senddate-col" useTooltip />

                <span className="ml0-5 flex-flex-children flex-item-centered-vert">
                    <ItemStar element={element} />
                </span>
            </div>

            <div className="flex flex-nowrap flex-align-items-center item-secondline max-w100 no-scroll">
                <div className="item-subject flex-item-fluid flex flex-nowrap flex-align-items-center">
                    {showIcon && (
                        <span className="flex flex-item-noshrink">
                            <ItemLocation element={element} labelID={labelID} />
                        </span>
                    )}

                    {conversationMode && <NumMessages className="mr0-25 flex-item-noshrink" conversation={element} />}

                    <span
                        role="heading"
                        aria-level={2}
                        className="inline-block max-w100 text-ellipsis"
                        title={Subject}
                        data-testid="message-column:subject"
                    >
                        {subjectContent}
                    </span>
                </div>

                <div className="item-icons flex flex-item-noshrink flex-nowrap">
                    <ItemLabels
                        className="ml0-5"
                        labels={labels}
                        element={element}
                        labelID={labelID}
                        maxNumber={breakpoints.isNarrow ? 1 : 5}
                        showDropdown={false}
                    />
                    <ItemAttachmentIcon
                        icon={hasOnlyIcsAttachments ? 'calendar-grid' : undefined}
                        element={element}
                        className="ml0-5 flex-align-self-center"
                    />
                </div>
            </div>

            {!!resultJSX && (
                <>
                    <div
                        className="flex flex-nowrap flex-align-items-center item-secondline max-w80 no-scroll"
                        aria-hidden="true"
                    >
                        <div className="item-subject flex-item-fluid flex flex-nowrap flex-align-items-center">
                            <span className="inline-block max-w100 text-ellipsis" title={bodyTitle}>
                                {resultJSX}
                            </span>
                        </div>
                    </div>
                    <div className="sr-only">{bodyTitle}</div>
                </>
            )}
        </div>
    );
};

export default ItemColumnLayout;
