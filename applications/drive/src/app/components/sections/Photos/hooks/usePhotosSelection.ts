import { useCallback, useMemo, useState } from 'react';

import { isPhotoGroup } from '../../../../store/_photos';
import type { PhotoGroup } from '../../../../store/_photos/interface';

type SelectionItem = { linkId: string };
type SelectionGroup = PhotoGroup;

export const getGroupLinkIds = <T extends SelectionItem>(data: (T | SelectionGroup)[], groupIndex: number) => {
    if (!isPhotoGroup(data[groupIndex])) {
        return [];
    }

    const items: string[] = [];

    for (let i = groupIndex + 1; i < data.length; i++) {
        const current = data[i];

        if (isPhotoGroup(current)) {
            break;
        }

        items.push(current.linkId);
    }

    return items;
};

export const usePhotosSelection = <T extends SelectionItem>(
    data: (T | SelectionGroup)[],
    photoLinkIdToIndexMap: Record<string, number>
) => {
    const [selection, setSelection] = useState<Record<string, boolean>>({});

    const setSelected = useCallback(
        (isSelected: boolean, ...linkIds: string[]) => {
            setSelection((state) => {
                let newState = { ...state };

                linkIds.forEach((linkId) => {
                    if (isSelected) {
                        newState[linkId] = true;
                    } else {
                        delete newState[linkId];
                    }
                });

                return newState;
            });
        },
        [setSelection]
    );

    const clearSelection = useCallback(() => {
        setSelection({});
    }, [setSelection]);

    const handleSelection = useCallback(
        (index: number, isSelected: boolean) => {
            const item = data[index];

            if (isPhotoGroup(item)) {
                setSelected(isSelected, ...getGroupLinkIds(data, index));
            } else {
                setSelected(isSelected, item.linkId);
            }
        },
        [setSelected, data]
    );

    const selectedItems = useMemo(
        () =>
            Object.keys(selection).reduce<T[]>((acc, linkId) => {
                const item = data[photoLinkIdToIndexMap[linkId]];
                if (item && !isPhotoGroup(item)) {
                    acc.push(item);
                }

                return acc;
            }, []),
        [selection, data, photoLinkIdToIndexMap]
    );

    const isGroupSelected = useCallback(
        (groupIndex: number) => {
            let linkIds = getGroupLinkIds(data, groupIndex);
            let selectedCount = 0;

            for (let linkId of linkIds) {
                if (selection[linkId]) {
                    selectedCount++;
                } else if (selectedCount > 0) {
                    break;
                }
            }

            if (selectedCount === 0) {
                return false;
            }

            return selectedCount === linkIds.length || 'some';
        },
        [data, selection]
    );

    const isItemSelected = useCallback((linkId: string) => !!selection[linkId], [selection]);

    return {
        selectedItems,
        setSelected,
        clearSelection,
        handleSelection,
        isGroupSelected,
        isItemSelected,
    };
};

export default usePhotosSelection;
