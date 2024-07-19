import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';

import { MatchColumnSelect } from '@/spreadsheet-import/components/MatchColumnSelect';
import { useSpreadsheetImportInternal } from '@/spreadsheet-import/hooks/useSpreadsheetImportInternal';
import { SelectOption } from '@/spreadsheet-import/types';
import { getFieldOptions } from '@/spreadsheet-import/utils/getFieldOptions';

import { IconChevronDown } from 'twenty-ui';
import {
  MatchedOptions,
  MatchedSelectColumn,
  MatchedSelectOptionsColumn,
} from '../MatchColumnsStep';

const StyledContainer = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(4)};
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing(1)};
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
  justify-content: space-between;
  padding: 0 ${({ theme }) => theme.spacing(2)};
  width: 100%;
`;

const StyledLabel = styled.span`
  color: ${({ theme }) => theme.font.color.primary};
  font-weight: ${({ theme }) => theme.font.weight.regular};
  font-size: ${({ theme }) => theme.font.size.md};
`;

const StyledControlLabel = styled.div`
  align-items: center;
  display: flex;
  gap: ${({ theme }) => theme.spacing(1)};
`;

const StyledIconChevronDown = styled(IconChevronDown)`
  color: ${({ theme }) => theme.font.color.tertiary};
`;

interface SubMatchingSelectProps<T> {
  option: MatchedOptions<T> | Partial<MatchedOptions<T>>;
  column: MatchedSelectColumn<T> | MatchedSelectOptionsColumn<T>;
  onSubChange: (val: T, index: number, option: string) => void;
}

export const SubMatchingSelect = <T extends string>({
  option,
  column,
  onSubChange,
}: SubMatchingSelectProps<T>) => {
  const { fields } = useSpreadsheetImportInternal<T>();
  const options = getFieldOptions(fields, column.value) as SelectOption[];
  const value = options.find((opt) => opt.value === option.value);
  const theme = useTheme();

  return (
    <StyledContainer>
      <StyledControlContainer>
        <StyledControlLabel>
          <StyledLabel>{option.entry}</StyledLabel>
        </StyledControlLabel>
        <StyledIconChevronDown size={theme.icon.size.md} />
      </StyledControlContainer>
      <MatchColumnSelect
        value={value}
        placeholder="Select..."
        onChange={(value) =>
          onSubChange(value?.value as T, column.index, option.entry ?? '')
        }
        options={options}
        name={option.entry}
        isSubmatchSelect
      />
    </StyledContainer>
  );
};
