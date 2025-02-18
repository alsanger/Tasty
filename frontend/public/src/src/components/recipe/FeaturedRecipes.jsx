import 'react';
import { Container, Row, Col } from 'react-bootstrap';
import RecipeCard from './RecipeCard';

// eslint-disable-next-line react/prop-types
const FeaturedRecipes = ({ recipes }) => {
    // eslint-disable-next-line react/prop-types
    const { recipeOfMonth, recipeOfWeek, recipeOfDay } = recipes;

    return (
        <Container className="featured-recipes mb-4">
            <Row>
                <Col md={4}>
                    <RecipeCard recipe={recipeOfMonth} />
                    <div className="featured-label">Рецепт місяця</div>
                </Col>
                <Col md={4}>
                    <RecipeCard recipe={recipeOfWeek} />
                    <div className="featured-label">Рецепт тижня</div>
                </Col>
                <Col md={4}>
                    <RecipeCard recipe={recipeOfDay} />
                    <div className="featured-label">Рецепт дня</div>
                </Col>
            </Row>
        </Container>
    );
};

export default FeaturedRecipes;