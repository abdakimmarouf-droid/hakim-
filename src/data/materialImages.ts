import steelImg from '@/src/assets/images/material_carbon_steel_1794598031689.jpg';
import aluminumImg from '@/src/assets/images/material_aluminum_alloy_1794598032300.jpg';
import copperImg from '@/src/assets/images/material_pure_copper_1794598032805.jpg';
import absImg from '@/src/assets/images/material_abs_polymer_1794598033652.jpg';
import carbonImg from '@/src/assets/images/material_carbon_fiber_1794598033304.jpg';
import type { MaterialId } from './materialsData';

export const MATERIAL_IMAGES: Record<MaterialId, string> = {
  steel: steelImg,
  aluminum: aluminumImg,
  copper: copperImg,
  abs: absImg,
  carbon: carbonImg,
};
