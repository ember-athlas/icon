import { tagName } from '@ember-decorators/component';
import { alias } from '@ember-decorators/object/computed';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import { icon, parse, toHtml } from '@fortawesome/fontawesome-svg-core';
import FaIconDecorator from 'videoathlyzer-client/pods/components/fa-icon/decorator/component';
import { scheduleOnce } from '@ember/runloop';

/**
 * Fontawesome Icon
 */
@tagName('')
export default class FaIcon extends Component {
	// arguments
	icon!: string;
	prefix: string = this.prefix || 'far';
	fw: boolean = this.fw || false;
	li: boolean = this.li || false;
	spin: boolean = this.spin || false;
	pulse: boolean = this.pulse || false;
	border: boolean = this.border || false;
	flip?: string;
	transform: string = this.transform || '';
	rotation?: string;
	size?: string;
	stack?: string;
	pull?: string;
	mask?: string;
	maskPrefix: string = this.maskPrefix || 'far';
	class: string = this.class || '';

	// BC
	@alias('fw') fixedWidth!: boolean;
	@alias('li') listItem!: boolean;

	// props
	html: string = '';
	style: string = htmlSafe('');
	viewBox?: string;
	classes?: string;
	decorators: FaIconDecorator[] = [];

	constructor() {
		super(...arguments);

		// ['icon', 'prefix', 'transform', 'mask'].forEach(key => {
		// 	this.addObserver(key, () => {
		// 		this.updateIcon();
		// 	});
		// });
	}

	didReceiveAttrs() {
		this.updateIcon();
	}

	updateIcon() {
		const iconLookup = {
			iconName: this.icon,
			prefix: this.prefix
		};

		const mask = {
			iconName: this.mask,
			prefix: this.maskPrefix
		};

		const classes = this.getClasses(this.class.split(' '));
		const params = {
			classes,
			mask,
			transform: parse.transform(this.transform),
		};

		let html: string = '';
		let rendered = icon(iconLookup, params);

		// THIS. DOES. NOT. WORK.
		// due to my limited understanding of svg but should be possible in general I guess
		// maybe getting the masks for each applied mask and then construct the
		// final svg

		for (let decorator of this.decorators) {
			rendered = icon({
				iconName: decorator.icon,
				prefix: decorator.prefix
			}, {
				classes,
				transform: parse.transform(decorator.transform!),
				mask: { icon: rendered.icon }
			});
		}

		if (rendered) {
			scheduleOnce('afterRender', this, () => {
				const abstract = rendered.abstract[0];

				abstract.attributes && Object.keys(abstract.attributes).forEach(attr => {
					if (attr === 'style') {
						this.set('style', htmlSafe(abstract.attributes[attr]));
					} else if (attr === 'viewBox') {
						this.set('viewBox', abstract.attributes[attr]);
					} else if (attr === 'class') {
						this.set('classes', abstract.attributes[attr]);
					}
				});

				if (abstract.children) {
					html = htmlSafe(abstract.children.reduce((acc, cur) => {
						return `${acc}${toHtml(cur)}`
					}, ''));
				}
				this.set('html', html);
			});
		}
	}

	getClasses(previousClasses: string[]) {
		let classes = {
			'fa-spin': this.spin,
			'fa-pulse': this.pulse,
			'fa-fw': this.fw,
			'fa-border': this.border,
			'fa-li': this.li,
			'fa-flip-horizontal': this.flip === 'horizontal' || this.flip === 'both',
			'fa-flip-vertical': this.flip === 'vertical' || this.flip === 'both',
			[`fa-${this.size}`]: this.size,
			[`fa-rotate-${this.rotation}`]: this.rotation,
			[`fa-pull-${this.pull}`]: this.pull,
			[`fa-stack-${this.stack}`]: this.stack,
		};

		return Object.keys(classes)
			.map(key => classes[key] ? key : null)
			.filter(key => key)
			.concat(previousClasses.filter(c => !c.match(/^fa-/)))
	}

	registerDecorator(decorator: FaIconDecorator) {
		this.decorators.pushObject(decorator);
		this.updateIcon();
	}

	unregisterDecorator(decorator: FaIconDecorator) {
		this.decorators.removeObject(decorator);
	}
}
