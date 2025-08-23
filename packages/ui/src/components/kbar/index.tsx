'use client';

import RenderResults from '@workspace/ui/components/kbar/render-result';
import {
  KBarAnimator,
  KBarPortal,
  KBarPositioner,
  KBarProvider,
  KBarSearch,
  useRegisterActions,
  Action,
  useKBar
} from 'kbar';

export type KBarAction = Action;

export default function KBar({
  children,
  actions = []
}: {
  children: React.ReactNode;
  actions?: Action[];
}) {
  return (
    <KBarProvider>
      <KBarComponent actions={actions}>{children}</KBarComponent>
    </KBarProvider>
  );
}

const KBarComponent = ({
  children,
  actions
}: {
  children: React.ReactNode;
  actions: Action[];
}) => {
  const { queryValue } = useKBar((state) => ({
    queryValue: state.searchQuery
  }));

  console.log('kbar queryValue', queryValue);

  useRegisterActions(actions, [actions]);

  return (
    <>
      <KBarPortal>
        <KBarPositioner className='bg-background/80 z-99999 p-0! fixed inset-0 backdrop-blur-sm'>
          <KBarAnimator className='bg-card text-card-foreground mt-64! -translate-y-12! relative w-full max-w-[400px] overflow-hidden rounded-lg border shadow-lg lg:max-w-[600px]'>
            <div className='bg-card border-border sticky top-0 z-10 border-b'>
              <KBarSearch className='bg-card outline-hidden focus:outline-hidden w-full border-none px-6 py-4 text-base focus:ring-0 focus:ring-offset-0' />
            </div>
            <div className='max-h-[400px]'>
              <RenderResults />
            </div>
          </KBarAnimator>
        </KBarPositioner>
      </KBarPortal>
      {children}
    </>
  );
};
