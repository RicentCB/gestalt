import { ReactNode } from 'react';
import { Badge, Box, Flex, IconButton, Link, Text, Tooltip } from 'gestalt';
import { useAppContext } from './appContext';
import trackButtonClick from './buttons/trackButtonClick';
import Card from './Card';
import clipboardCopy from './clipboardCopy';
import Markdown from './Markdown';
import capitalizeFirstLetter from '../utils/capitalizeFirstLetter';

const unifyQuotes = (input: string): string => input.replace(/'/g, '"');

async function copyType(code: string) {
  try {
    await clipboardCopy(code);
  } catch (error: any) {
    // eslint-disable-next-line no-console
    console.error(error);
  }
}

function isNumeric(value: string) {
  return /^-?\d+(\.\d+)?$/.test(value);
}

const transformDefaultValue = (input?: number | string | boolean | null) => {
  if (input === 'true') {
    return true;
  }
  if (input === 'false') {
    return false;
  }
  if (typeof input === 'string' && isNumeric(input)) {
    return parseFloat(input);
  }
  return input;
};

type Prop = {
  defaultValue?: boolean | string | number | null;
  description?: string | ReadonlyArray<string>;
  href?: string;
  name: string;
  nullable?: boolean;
  required?: boolean;
  responsive?: boolean;
  type: string;
};

const sortBy = (list: ReadonlyArray<Prop>, fn: (arg1: Prop) => string) =>
  [...list].sort((a, b) => fn(a).localeCompare(fn(b)));

function FormattedCode({ children }: { children: ReactNode }) {
  return (
    <code>
      <pre style={{ margin: 0, overflowX: 'scroll', minWidth: 510 }}>{children}</pre>
    </code>
  );
}

function Description(lines: ReadonlyArray<string>) {
  return (
    <Flex
      alignItems="start"
      direction="column"
      gap={{
        row: 0,
        column: 2,
      }}
    >
      {lines.map((line) => (
        <Markdown key={line} text={line} textColor="subtle" />
      ))}
    </Flex>
  );
}

function Th({ children }: { children?: ReactNode }) {
  return (
    <th style={{ borderBottom: '2px solid #ddd' }}>
      <Box padding={2}>
        <Text overflow="normal" size="200" weight="bold">
          {children}
        </Text>
      </Box>
    </th>
  );
}

function Td({
  border = true,
  children,
  colspan = 1,
  shrink = false,
  color = 'default',
}: {
  border?: boolean;
  children?: ReactNode;
  colspan?: number;
  shrink?: boolean;
  color?: 'default' | 'subtle';
}) {
  return (
    <td
      colSpan={colspan}
      style={{
        // @ts-expect-error - TS2322 - Type 'string | null' is not assignable to type 'BorderBottom<string | number> | undefined'.
        borderBottom: border ? '1px solid #ddd' : null,
        padding: 0,
        verticalAlign: 'top',
        // @ts-expect-error - TS2322 - Type 'string | null' is not assignable to type 'Width<string | number> | undefined'.
        width: shrink ? '1px' : null,
      }}
    >
      <Box marginBottom={border ? 2 : 0} marginTop={2} paddingX={2}>
        <Text color={color} overflow="normal">
          {children}
        </Text>
      </Box>
    </td>
  );
}

export default function PropTable({
  componentName,
  id = '',
  name: proptableName,
  props: properties,
}: {
  componentName: string;
  id?: string;
  name?: string;
  props: ReadonlyArray<Prop>;
}) {
  const { propTableVariant, setPropTableVariant } = useAppContext();
  const propsId = `${id}Props`;

  return (
    <Card
      headingSize={proptableName ? '400' : '600'}
      id={propsId}
      name={proptableName ? `${proptableName} Props` : 'Props'}
      toggle={
        <Tooltip inline text={`${propTableVariant === 'expanded' ? 'Collapse' : 'Expand'} props`}>
          <IconButton
            accessibilityLabel={`${
              propTableVariant === 'expanded' ? 'Collapse' : 'Expand'
            } props for ${componentName || ''}`}
            icon={propTableVariant === 'expanded' ? 'minimize' : 'maximize'}
            iconColor="darkGray"
            onClick={() =>
              setPropTableVariant(propTableVariant === 'expanded' ? 'collapsed' : 'expanded')
            }
            size="xs"
          />
        </Tooltip>
      }
    >
      {propTableVariant === 'expanded' ? (
        <Box
          dangerouslySetInlineStyle={{ __style: { overflowY: 'hidden' } }}
          marginBottom={12}
          marginTop={4}
          overflow="auto"
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              tableLayout: 'auto',
            }}
          >
            <Box
              as="caption"
              dangerouslySetInlineStyle={{
                __style: {
                  clip: 'rect(1px, 1px, 1px, 1px)',
                  whiteSpace: 'nowrap',
                },
              }}
              height={1}
              overflow="hidden"
              position="absolute"
              width={1}
            >
              {proptableName ? `${proptableName} subcomponent props` : 'Component props'}
            </Box>

            <thead>
              <tr>
                {['Name', 'Type', 'Default'].map((item) => (
                  <Th key={item}>{item}</Th>
                ))}
              </tr>
            </thead>

            <tbody>
              {properties.length > 0 ? (
                sortBy(properties, ({ required, name }) => `${required ? 'a' : 'b'}${name}`).reduce<
                  ReadonlyArray<ReactNode>
                >(
                  (
                    acc,
                    {
                      defaultValue,
                      description = '',
                      href,
                      name,
                      required,
                      responsive,
                      nullable,
                      type,
                    },
                  ) => {
                    const newAcc = [...acc];
                    const propNameHasSecondRow = description || responsive;
                    const transformedDefaultValue = transformDefaultValue(defaultValue);
                    newAcc.push(
                      <tr key={name}>
                        <Td border={!propNameHasSecondRow} shrink>
                          <Box
                            dangerouslySetInlineStyle={{
                              __style: {
                                scrollMarginTop: 60,
                              },
                            }}
                            id={`${propsId}-${name}`}
                          >
                            <Flex
                              gap={{
                                row: 2,
                                column: 0,
                              }}
                            >
                              <Text overflow="normal" underline={!!href}>
                                {href ? (
                                  <Link href={`#${href}`}>
                                    <code>{name}</code>
                                  </Link>
                                ) : (
                                  <code>{name}</code>
                                )}
                              </Text>
                              {required && <Badge text="Required" type="warning" />}
                            </Flex>
                          </Box>
                        </Td>

                        <Td border={!propNameHasSecondRow}>
                          <Flex justifyContent="between">
                            <FormattedCode>
                              {nullable ? `?${unifyQuotes(type)}` : unifyQuotes(type)}
                            </FormattedCode>

                            <IconButton
                              accessibilityLabel="Copy TypeScript type"
                              icon="copy-to-clipboard"
                              iconColor="darkGray"
                              onClick={() => {
                                trackButtonClick(
                                  'Copy TypeScript type',
                                  `${componentName} - ${name}`,
                                );
                                copyType(`ComponentProps<typeof ${componentName}>['${name}']`);
                              }}
                              size="xs"
                              tooltip={{
                                text: 'Copy type',
                                inline: true,
                                idealDirection: 'up',
                                accessibilityLabel: '',
                              }}
                            />
                          </Flex>
                        </Td>

                        <Td
                          border={!propNameHasSecondRow}
                          color={defaultValue != null ? 'default' : 'subtle'}
                          shrink
                        >
                          {defaultValue != null ? (
                            <code>{JSON.stringify(transformedDefaultValue)}</code>
                          ) : (
                            '-'
                          )}
                        </Td>
                      </tr>,
                    );

                    if (propNameHasSecondRow) {
                      newAcc.push(
                        <tr key={`${name}-second-row`}>
                          <Td colspan={1}>
                            {responsive && (
                              <Box marginTop={6}>
                                <Text>
                                  <code>
                                    sm{capitalizeFirstLetter(name)}, md
                                    {capitalizeFirstLetter(name)}, lg
                                    {capitalizeFirstLetter(name)}
                                  </code>
                                </Text>
                              </Box>
                            )}
                          </Td>
                          <Td color="default" colspan={1}>
                            {description && (
                              <Box marginTop={6}>
                                {Array.isArray(description) ? (
                                  Description(description)
                                ) : (
                                  // @ts-expect-error - TS2322 - Type 'string | readonly string[]' is not assignable to type 'string'.
                                  <Markdown text={description} textColor="default" />
                                )}
                              </Box>
                            )}
                          </Td>
                          <Td />
                        </tr>,
                      );
                    }
                    return newAcc;
                  },
                  [],
                )
              ) : (
                <tr>
                  <Td color="subtle" colspan={3}>
                    No properties
                  </Td>
                </tr>
              )}
            </tbody>
          </table>
        </Box>
      ) : (
        <Box marginBottom={8} />
      )}
    </Card>
  );
}
