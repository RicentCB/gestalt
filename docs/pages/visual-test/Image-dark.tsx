import { Box, ColorSchemeProvider, DesignTokensProvider, Image } from 'gestalt';

export default function Snapshot() {
  return (
    <ColorSchemeProvider colorScheme="dark">
      <DesignTokensProvider>
        <Box color="default" display="inlineBlock" padding={1}>
          <Box height={84} width={84}>
            <Image
              alt="Tropic greens: The taste of Petrol and Porcelain | Interior design, Vintage Sets and Unique Pieces agave"
              color="rgb(231, 186, 176)"
              naturalHeight={496}
              naturalWidth={496}
              src="https://i.ibb.co/FY2MKr5/stock6.jpg"
            />
          </Box>
        </Box>
      </DesignTokensProvider>
    </ColorSchemeProvider>
  );
}
