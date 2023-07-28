import { Button } from '@nextui-org/button';
import { Chip } from '@nextui-org/chip';
import { useMatches, useNavigate, useParams } from '@remix-run/react';
import { motion, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useHydrated } from 'remix-utils';

import { useHeaderStyle } from '~/store/layout/useHeaderStyle';
import { useHistoryStack } from '~/store/layout/useHistoryStack';
import { useLayout } from '~/store/layout/useLayout';
import { useHeaderOptions } from '~/hooks/useHeader';
import { useSoraSettings } from '~/hooks/useLocalStorage';
import { Breadcrumb } from '~/components/elements/Breadcrumb';
import ChevronLeft from '~/assets/icons/ChevronLeftIcon';
import ChevronRight from '~/assets/icons/ChevronRightIcon';

const ControlNavigation = () => {
  const navigate = useNavigate();
  const matches = useMatches();
  const isHydrated = useHydrated();
  const params = useParams();
  const { t } = useTranslation();
  const { isShowBreadcrumb } = useSoraSettings();
  const { scrollY } = useLayout((state) => state);
  const { startChangeScrollPosition } = useHeaderStyle((state) => state);
  const { currentMiniTitle, customHeaderChangeColorOnScroll } = useHeaderOptions();
  const { historyBack, historyForward } = useHistoryStack((state) => state);
  const opacity = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 80],
    [0, 0, customHeaderChangeColorOnScroll ? (startChangeScrollPosition ? 1 : 0) : 1],
  );
  const y = useTransform(
    scrollY,
    [0, startChangeScrollPosition, startChangeScrollPosition + 80],
    [60, 60, customHeaderChangeColorOnScroll ? (startChangeScrollPosition ? 0 : 60) : 0],
  );
  const handleNavigationBackForward = (direction: 'back' | 'forward') => {
    if (direction === 'back') {
      navigate(-1);
    } else if (direction === 'forward') {
      navigate(1);
    }
  };

  return (
    <div className="flex flex-row items-center justify-center gap-x-2">
      <Button
        variant="faded"
        radius="full"
        isIconOnly
        onPress={() => handleNavigationBackForward('back')}
        isDisabled={historyBack.length <= 1}
        className="h-9 w-9"
        size="sm"
      >
        <ChevronLeft />
      </Button>
      <Button
        variant="faded"
        radius="full"
        isIconOnly
        onPress={() => handleNavigationBackForward('forward')}
        isDisabled={historyForward.length <= 1}
        className="h-9 w-9"
        size="sm"
      >
        <ChevronRight />
      </Button>
      {isHydrated ? (
        isShowBreadcrumb.value ? (
          <Chip color="default" variant="faded" size="lg">
            <Breadcrumb>
              {matches
                // skip routes that don't have a breadcrumb
                .filter((match) => match.handle && match.handle.breadcrumb)
                // render breadcrumbs!
                .map((match) => match?.handle?.breadcrumb({ match, t, params }))}
            </Breadcrumb>
          </Chip>
        ) : currentMiniTitle ? (
          <motion.div
            style={{ opacity, y }}
            transition={{ duration: 0.3 }}
            className="flex flex-row items-center justify-start gap-x-3"
          >
            {currentMiniTitle.showImage ? (
              <img
                src={currentMiniTitle.imageUrl}
                alt={`${currentMiniTitle.title} mini`}
                width={36}
                height={54}
                loading="lazy"
                className="rounded-small"
              />
            ) : null}
            <div className="flex flex-col items-start justify-center">
              <span className="text-2xl font-bold">{currentMiniTitle.title}</span>
              {currentMiniTitle.subtitle ? (
                <span className="text-sm font-medium opacity-75">{currentMiniTitle.subtitle}</span>
              ) : null}
            </div>
          </motion.div>
        ) : null
      ) : null}
    </div>
  );
};

export default ControlNavigation;
