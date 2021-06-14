import { h, Component, render } from "preact";
import { useState } from 'preact/hooks';
import CircularSlider from 'react-circular-slider-svg';

type ExpandableProps = {
    disabled?: boolean
    coerceToInt?: boolean;
    value: number;
    arcColor?: string;
    func: any;
    size?: number;
    name?: string;
    onControlFinished?: any
};

// Types for state
type ExpandableState = {};

export default class KnobUI extends Component<ExpandableProps, ExpandableState>
{
    render ()
    {
        const { value, coerceToInt, arcColor, func, disabled, size, name, onControlFinished } = this.props;

        return (
            <div className='svgKnob'>
                <p>{name}</p>
            {/* @ts-ignore */}
            <CircularSlider
                handle1={{
                    value: value,
                    onChange: (v: number) => {func(v)}
                    }}
                onControlFinished= {onControlFinished}
                minValue={0}
                maxValue={127}
                disabled={disabled || false}
                coerceToInt={coerceToInt || false}
                arcColor={arcColor || "#5fcde4"}
                arcBackgroundColor='#cbdbfc'
                startAngle={30}
                endAngle={330}
                size={size || 60}
                />
            </div>
        )
    }
}
