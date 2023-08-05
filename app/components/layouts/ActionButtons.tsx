import { Button } from '@nextui-org/button';
import { motion, useTransform } from 'framer-motion';

import { useLayout } from '~/store/layout/useLayout';
import Arrow from '~/assets/icons/ArrowIcon';

const ActionButtons = () => {
  const { scrollY, viewportRef } = useLayout((state) => state);
  const opacity = useTransform(scrollY, [0, 80], [0, 1]);
  const y = useTransform(scrollY, [0, 80], [100, 0]);
  const handleButtonPress = () => {
    viewportRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };
  return (
    <motion.div
      style={{ opacity, y }}
      className="fixed bottom-24 right-8 z-[3999] flex flex-col items-center sm:bottom-8"
    >
      <Button
        color="primary"
        size="lg"
        radius="full"
        isIconOnly
        onPress={() => handleButtonPress()}
        className="shadow-2xl"
      >
        <Arrow direction="up" />
      </Button>
    </motion.div>
  );
};

export default ActionButtons;
