import { ReactNode, useEffect } from 'react';
import { useGlobalEventsHandlerContext } from './contexts/GlobalEventsHandlerProvider';
import InternalFieldset from './Fieldset/InternalFieldset';
import Flex from './Flex';
import { RadioGroupContextProvider } from './RadioGroup/Context';
import style from './RadioGroup/RadioButton.css';
import RadioGroupButton from './RadioGroupButton';
import useExperimentalTheme from './utils/useExperimentalTheme';

type Props = {
  /**
   * A collection of RadioGroup.RadioButtons representing the available options, as well as any Labels or layout components (Box, Flex, etc.), if needed. Other components such as Checkboxes should not be included. Note that children can be grouped into organizational components if desired.
   *
   */
  children: ReactNode;
  /**
   * A unique identifier for this RadioGroup.
   *
   */
  id: string;
  /**
   * The description of the radio group that tells users what is being asked of them.
   *
   */
  legend: string;
  /**
   * Determines the layout of the group. See the [direction](https://gestalt.pinterest.systems/web/radiogroup#Direction) variant to learn more.
   *
   */
  direction?: 'column' | 'row';
  /**
   * Adds an error message below the group of radio buttons. See the [error](https://gestalt.pinterest.systems/web/radiogroup#With-an-error) variant to learn more.
   *
   */
  errorMessage?: string;
  /**
   * Whether the legend should be visible or not. If hidden, the legend is still available for screen reader users, but does not appear visually. See the [legend visibility](https://gestalt.pinterest.systems/web/radiogroup#Legend-visibility) variant to learn more.
   *
   */
  legendDisplay?: 'visible' | 'hidden';
  /**
   * Adds an help message below the group of radio buttons.
   *
   */
  helperText?: string;
};

/**
 *  [RadioGroups](https://gestalt.pinterest.systems/web/radiogroup) are used for selecting only 1 item from a list of 2 or more items. If you need multiple selection or have only one option, use [Checkbox](https://gestalt.pinterest.systems/web/checkbox). If you need to provide a binary on/off choice that takes effect immediately, use [Switch](https://gestalt.pinterest.systems/web/switch).
 *
 */
function RadioGroup({
  children,
  direction = 'column',
  errorMessage,
  id,
  legend,
  legendDisplay = 'visible',
  helperText,
}: Props) {
  // Consume GlobalEventsHandlerProvider
  const { radioGroupHandlers } = useGlobalEventsHandlerContext() ?? {
    radioGroupHandlers: undefined,
  };

  useEffect(() => {
    if (radioGroupHandlers?.onRender) radioGroupHandlers?.onRender();
  }, [radioGroupHandlers]);

  const theme = useExperimentalTheme();

  return (
    <RadioGroupContextProvider value={{ parentName: 'RadioGroup' }}>
      <InternalFieldset
        errorMessage={errorMessage}
        helperText={helperText}
        id={id}
        legend={legend}
        legendDisplay={legendDisplay}
        marginTop
      >
        <Flex
          direction={direction}
          gap={direction === 'row' ? { column: 0, row: 4 } : { column: 2, row: 0 }}
        >
          {theme.MAIN && direction === 'column' ? (
            <div className={style.wrapper}>{children}</div>
          ) : (
            children
          )}
        </Flex>
      </InternalFieldset>
    </RadioGroupContextProvider>
  );
}

RadioGroup.displayName = 'RadioGroup';

RadioGroup.RadioButton = RadioGroupButton;

export default RadioGroup;
