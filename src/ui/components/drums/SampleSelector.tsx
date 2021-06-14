import { h, Component, createRef } from "preact";

type ExpandableProps = {
    func: Function
};

// Types for state
type ExpandableState = {
    
};

export class SampleSelector extends Component<ExpandableProps, ExpandableState>
{
    ref = createRef();

    constructor(props: any)
    {
        super(props);
        this.handleChange = this.handleChange.bind(this);
    }

    async handleChange(e: h.JSX.TargetedEvent<HTMLInputElement, Event>)
    {
        const target = e.target as any;

        const file = target.files[0];

        if (!file.type.startsWith('audio'))
        {
            alert('only audio files are accepted');

            return;
        }

        const fileToBase64 = await this.toBase64(file);

        await this.props.func(fileToBase64, file.name);
    }

    componentDidMount ()
    {
        this.ref.current.click();
    }

    async toBase64 (file: Blob)
    {
        return new Promise((resolve, reject) =>
        {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }

    render ()
    {
        return <div>
            <input ref={this.ref} type="file" onChange={ (e) => this.handleChange(e) } style={{display: 'none'}} />
        </div>;
    }
}