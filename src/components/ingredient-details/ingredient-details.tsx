import { FC, memo } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';

import { useSelector } from '../../services/store';
import { useParams } from 'react-router-dom';
import { IngredientDetailsProps } from './type';

export const IngredientDetails: FC<IngredientDetailsProps> = memo(
  ({ title, isModal }) => {
    const { id } = useParams();

    const ingredientData = useSelector((state) =>
      state.ingredients.ingredients.find((ingredient) => ingredient._id === id)
    );

    if (!ingredientData) {
      return <Preloader />;
    }

    return (
      <IngredientDetailsUI
        ingredientData={ingredientData}
        title={title}
        isModal={isModal}
      />
    );
  }
);
