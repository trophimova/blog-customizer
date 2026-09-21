import {
  defaultArticleState,
  fontFamilyOptions,
  fontSizeOptions,
  fontColors,
  backgroundColors,
  contentWidthArr,
} from '@/constants/articleProps';
import { clsx } from 'clsx';
import { useEffect, useRef, useState } from 'react';
import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { RadioGroup } from 'src/ui/radio-group';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';

import type { ArticleStateType } from '@/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
  onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({
  onApply,
}: ArticleParamsFormProps): React.JSX.Element => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [articleFormState, setArticleFormState] =
    useState<ArticleStateType>(defaultArticleState);
  const panelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isSidebarOpen) {
      return;
    }

    const handleOutsideClick = (event: MouseEvent): void => {
      if (
        panelRef.current &&
        event.target instanceof Node &&
        !panelRef.current.contains(event.target)
      ) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return (): void => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isSidebarOpen]);

  const handleFieldChange =
    <K extends keyof ArticleStateType>(field: K) =>
    (selected: ArticleStateType[K]): void => {
      setArticleFormState((prevState) => ({
        ...prevState,
        [field]: selected,
      }));
    };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    onApply(articleFormState);
  };

  const handleReset = (event: React.FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    setArticleFormState(defaultArticleState);
    onApply(defaultArticleState);
  };

  return (
    <div ref={panelRef}>
      <ArrowButton
        isOpen={isSidebarOpen}
        onClick={() => setIsSidebarOpen((prev) => !prev)}
      />
      <aside
        className={clsx(styles.container, { [styles.container_open]: isSidebarOpen })}
      >
        <form className={styles.form} onSubmit={handleSubmit} onReset={handleReset}>
          <Text as="h1" size={31} weight={800} uppercase>
            Задайте параметры
          </Text>
          <Select
            title="Шрифт"
            selected={articleFormState.fontFamilyOption}
            options={fontFamilyOptions}
            onChange={handleFieldChange('fontFamilyOption')}
          />
          <RadioGroup
            name="fontSize"
            title="Размер шрифта"
            selected={articleFormState.fontSizeOption}
            options={fontSizeOptions}
            onChange={handleFieldChange('fontSizeOption')}
          />
          <Select
            title="Цвет шрифта"
            selected={articleFormState.fontColor}
            options={fontColors}
            onChange={handleFieldChange('fontColor')}
          />
          <Separator />
          <Select
            title="Цвет фона"
            selected={articleFormState.backgroundColor}
            options={backgroundColors}
            onChange={handleFieldChange('backgroundColor')}
          />
          <Select
            title="Ширина контента"
            selected={articleFormState.contentWidth}
            options={contentWidthArr}
            onChange={handleFieldChange('contentWidth')}
          />
          <div className={styles.bottomContainer}>
            <Button title="Сбросить" htmlType="reset" type="clear" />
            <Button title="Применить" htmlType="submit" type="apply" />
          </div>
        </form>
      </aside>
    </div>
  );
};
