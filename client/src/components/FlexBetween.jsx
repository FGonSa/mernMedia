import { Box } from "@mui/material";
import { styled } from "@mui/system";

//Componente para aplicar un flex en CSS en distintas áreas
const FlexBetween = styled(Box)({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
});

export default FlexBetween;
