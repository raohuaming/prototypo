import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

import LocalClient from '~/stores/local-client.stores.jsx';

import Modal from '../shared/modal.components.jsx';
import InputWithLabel from '../shared/input-with-label.components.jsx';
import Button from '../shared/button.components.jsx';

export default class ChangeNameFamily extends React.Component {
	constructor(props) {
		super(props);
		this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
		this.exit = this.exit.bind(this);
		this.editFamily = this.editFamily.bind(this);
	}

	componentWillMount() {
		this.client = LocalClient.instance();
	}

	exit() {
		this.client.dispatchAction('/store-value', {openChangeFamilyNameModal: false});
	}

	editFamily() {
		this.client.dispatchAction('/edit-family-name', {
			family: this.props.family,
			newName: this.refs.newName.inputValue,
		});
	}

	render() {
		return (
			<Modal>
				<div className="modal-container-title">Change family name</div>
				<InputWithLabel ref="newName" inputValue={this.props.family.name}/>
				<div className="add-family-form-buttons">
					<Button click={this.exit} label="Cancel" neutral={true}/>
					<Button click={this.editFamily} label="Change family name"/>
				</div>
			</Modal>
		);
	}
}