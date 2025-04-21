// Файл components/RecipeFilterSidebar/components/DifficultyFilter.jsx:
import React from 'react';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

const DifficultyFilter = ({ minDifficulty, maxDifficulty, onChange }) => {
    const handleChange = (values) => {
        onChange(values[0], values[1]);
    };

    return (
        <div className="filter-section">
            <div className="difficulty-slider">
                <Slider
                    range
                    min={1}
                    max={10}
                    marks={{
                        1: '1',
                        2: '2',
                        3: '3',
                        4: '4',
                        5: '5',
                        6: '6',
                        7: '7',
                        8: '8',
                        9: '9',
                        10: '10'
                    }}
                    value={[minDifficulty, maxDifficulty]}
                    onChange={handleChange}
                    trackStyle={[{ backgroundColor: 'var(--primary-color)' }]}
                    handleStyle={[
                        { borderColor: 'var(--primary-color)', backgroundColor: 'var(--primary-color)' },
                        { borderColor: 'var(--primary-color)', backgroundColor: 'var(--primary-color)' }
                    ]}
                    railStyle={{ backgroundColor: '#eee' }}
                />
            </div>
        </div>
    );
};

export default DifficultyFilter;