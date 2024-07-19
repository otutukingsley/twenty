import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import {
  autoUpdate,
  flip,
  offset,
  size,
  useFloating,
} from '@floating-ui/react';
import React, { useCallback, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  AppTooltip,
  IconChevronDown,
  TablerIconsProps,
  Tag,
  TagColor,
} from 'twenty-ui';
import { ReadonlyDeep } from 'type-fest';
import { useDebouncedCallback } from 'use-debounce';

import { SelectOption } from '@/spreadsheet-import/types';
import { DropdownMenu } from '@/ui/layout/dropdown/components/DropdownMenu';
import { DropdownMenuItemsContainer } from '@/ui/layout/dropdown/components/DropdownMenuItemsContainer';
import { DropdownMenuSearchInput } from '@/ui/layout/dropdown/components/DropdownMenuSearchInput';
import { DropdownMenuSeparator } from '@/ui/layout/dropdown/components/DropdownMenuSeparator';
import { MenuItem } from '@/ui/navigation/menu-item/components/MenuItem';
import { MenuItemSelect } from '@/ui/navigation/menu-item/components/MenuItemSelect';
import { useListenClickOutside } from '@/ui/utilities/pointer-event/hooks/useListenClickOutside';
import { useUpdateEffect } from '~/hooks/useUpdateEffect';

const StyledFloatingDropdown = styled.div`
  z-index: ${({ theme }) => theme.lastLayerZIndex};
`;

const StyledControlContainer = styled.div`
  align-items: center;
  background-color: ${({ theme }) => theme.background.transparent.lighter};
  border: 1px solid ${({ theme }) => theme.border.color.medium};
  box-sizing: border-box;
  border-radius: ${({ theme }) => theme.border.radius.sm};
  color: ${({ theme }) => theme.font.color.primary};
  cursor: 'pointer';
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
  height: ${({ theme }) => theme.spacing(8)};
  padding: 0 ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

const StyledLabel = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  font-size: ${({ theme }) => theme.font.size.md};
`;

const StyledContainer = styled.div`
  width: 100%;
`;

const StyledIconChevronDown = styled(
  IconChevronDown as (
    props: TablerIconsProps & { isSubmatchSelect: boolean },
  ) => JSX.Element,
)`
  color: ${({ theme }) => theme.font.color.tertiary};
  margin-left: ${({ isSubmatchSelect }) => (isSubmatchSelect ? '0' : 'auto')};
`;

interface MatchColumnSelectProps {
  onChange: (value: ReadonlyDeep<SelectOption> | null) => void;
  value?: ReadonlyDeep<SelectOption>;
  options: readonly ReadonlyDeep<SelectOption>[];
  placeholder?: string;
  name?: string;
  isSubmatchSelect?: boolean;
}

export const MatchColumnSelect = ({
  onChange,
  value,
  options: initialOptions,
  placeholder,
  isSubmatchSelect = false,
}: MatchColumnSelectProps) => {
  const theme = useTheme();

  const dropdownContainerRef = useRef<HTMLDivElement>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');
  const [options, setOptions] = useState(initialOptions);

  const { refs, floatingStyles } = useFloating({
    strategy: 'absolute',
    middleware: [
      offset(() => {
        return parseInt(theme.spacing(2), 10);
      }),
      flip(),
      size(),
    ],
    whileElementsMounted: autoUpdate,
    open: isOpen,
    placement: 'bottom-start',
  });

  const handleSearchFilterChange = useCallback(
    (text: string) => {
      setOptions(
        initialOptions.filter((option) =>
          option.label.toLowerCase().includes(text.toLowerCase()),
        ),
      );
    },
    [initialOptions],
  );

  const debouncedHandleSearchFilter = useDebouncedCallback(
    handleSearchFilterChange,
    100,
    {
      leading: true,
    },
  );

  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.currentTarget.value;

    setSearchFilter(value);
    debouncedHandleSearchFilter(value);
  };

  const handleDropdownItemClick = () => {
    setIsOpen(true);
  };

  const handleChange = (option: ReadonlyDeep<SelectOption>) => {
    onChange(option);
    setIsOpen(false);
  };

  useListenClickOutside({
    refs: [dropdownContainerRef],
    callback: () => {
      setIsOpen(false);
    },
  });

  useUpdateEffect(() => {
    setOptions(initialOptions);
  }, [initialOptions]);

  return (
    <StyledContainer>
      <div ref={refs.setReference}>
        <StyledControlContainer onClick={handleDropdownItemClick} id="control">
          {!!value?.icon && (
            <value.icon
              color={theme.font.color.primary}
              size={theme.icon.size.md}
              stroke={theme.icon.stroke.sm}
            />
          )}
          {isSubmatchSelect && value ? (
            <Tag
              text={value?.label ?? placeholder}
              color={value.color as TagColor}
            />
          ) : (
            <StyledLabel>{value?.label ?? placeholder ?? ''}</StyledLabel>
          )}

          <StyledIconChevronDown
            size={theme.icon.size.md}
            isSubmatchSelect={isSubmatchSelect}
          />
        </StyledControlContainer>
      </div>
      {isOpen &&
        createPortal(
          <StyledFloatingDropdown ref={refs.setFloating} style={floatingStyles}>
            <DropdownMenu
              data-select-disable
              ref={dropdownContainerRef}
              // width={refs.domReference.current?.clientWidth}
            >
              <DropdownMenuSearchInput
                value={searchFilter}
                onChange={handleFilterChange}
                autoFocus
              />
              <DropdownMenuSeparator />
              <DropdownMenuItemsContainer hasMaxHeight>
                {options?.map((option) => (
                  <React.Fragment key={option.label}>
                    <MenuItemSelect
                      selected={value?.label === option.label}
                      onClick={() => handleChange(option)}
                      disabled={
                        option.disabled && value?.value !== option.value
                      }
                      LeftIcon={option?.icon}
                      text={option.label}
                    />
                    {option.disabled &&
                      value?.value !== option.value &&
                      createPortal(
                        <AppTooltip
                          key={option.value}
                          anchorSelect={`#${option.value}`}
                          content="You are already importing this column."
                          place="right"
                          offset={-20}
                        />,
                        document.body,
                      )}
                  </React.Fragment>
                ))}
                {options?.length === 0 && (
                  <MenuItem key="No result" text="No result" />
                )}
              </DropdownMenuItemsContainer>
            </DropdownMenu>
          </StyledFloatingDropdown>,
          document.body,
        )}
    </StyledContainer>
  );
};
