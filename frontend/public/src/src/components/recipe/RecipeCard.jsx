import 'react';
import { Card } from 'react-bootstrap';

// eslint-disable-next-line react/prop-types
const RecipeCard = ({ recipe }) => {
    return (
        <Card className="recipe-card">
            <Card.Img variant="top" src={recipe.image_url} />
            <Card.Body>
                {/* eslint-disable-next-line react/prop-types */}
                <Card.Title>{recipe.title}</Card.Title>
                <div className="recipe-meta">
                    <span>{recipe.cooking_time} хв</span>
                    <span className="mx-2">•</span>
                    <span>{recipe.difficulty}</span>
                </div>
            </Card.Body>
        </Card>
    );
};

export default RecipeCard;