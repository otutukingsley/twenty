import styled from '@emotion/styled';

import { CircularProgressBar } from '@/ui/feedback/progress-bar/components/CircularProgressBar';
import { MainButton } from '@/ui/input/button/components/MainButton';
import { Modal } from '@/ui/layout/modal/components/Modal';
import { isUndefinedOrNull } from '~/utils/isUndefinedOrNull';

const StyledFooter = styled(Modal.Footer)<{ hasBackButton: boolean }>`
  gap: ${({ theme }) => theme.spacing(2.5)};
  justify-content: ${({ hasBackButton }) =>
    hasBackButton ? 'space-between' : 'center'};
  padding: ${({ theme }) => theme.spacing(6)} ${({ theme }) => theme.spacing(8)};
`;

type StepNavigationButtonProps = {
  onClick: () => void;
  title: string;
  isLoading?: boolean;
  onBack?: () => void;
};

export const StepNavigationButton = ({
  onClick,
  title,
  isLoading,
  onBack,
}: StepNavigationButtonProps) => {
  const hasBackButton = !isUndefinedOrNull(onBack);
  return (
    <StyledFooter hasBackButton={hasBackButton}>
      {hasBackButton && (
        <MainButton
          Icon={isLoading ? CircularProgressBar : undefined}
          title="Back"
          onClick={!isLoading ? onBack : undefined}
          variant="secondary"
        />
      )}
      <MainButton
        Icon={isLoading ? CircularProgressBar : undefined}
        title={title}
        onClick={!isLoading ? onClick : undefined}
        variant="primary"
        width={hasBackButton ? undefined : 200}
      />
    </StyledFooter>
  );
};
