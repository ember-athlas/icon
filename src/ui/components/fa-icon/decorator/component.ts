import { tagName } from '@ember-decorators/component';
import Component from '@ember/component';
import FaIcon from 'videoathlyzer-client/pods/components/fa-icon/component';

@tagName('')
export default class FaIconDecorator extends Component {

	// arguments
	parent!: FaIcon;
	position!: string;
	icon!: string;
	prefix: string = this.prefix || 'far';
	transform?: string;

	// properties
	x: number = this.x || 6;
	y: number = this.y || 6;
	transformPosition?: string;

	constructor() {
		super(...arguments);

		this.parent.registerDecorator(this);

		if (this.position && !this.transform) {
			this.handlePosition(this.position);
		}

		this.addObserver('position', () => {
			this.handlePosition(this.position);
		});
	}

	willDestroyElement() {
		super.willDestroyElement();

		this.parent.unregisterDecorator(this);
	}

	handlePosition(position: string) {
		let transform = '';
		switch (position) {
			case 'tl':
				transform = `up-${this.y} left-${this.x}`;
				break;

			case 'tr':
				transform = `up-${this.y} right-${this.x}`;
				break;

			case 'bl':
				transform = `down-${this.y} left-${this.x}`;
				break;

			case 'br':
				transform = `down-${this.y} right-${this.x}`;
		}

		if (transform) {
			this.set('transformPosition', transform);
			this.set('transform', transform);
		}
	}
}
