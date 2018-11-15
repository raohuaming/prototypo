import gql from 'graphql-tag';
import React from 'react';
import {Query} from 'react-apollo';
import PropTypes from 'prop-types';
import {Redirect, Link, withRouter} from 'react-router-dom';
import {Elements} from 'react-stripe-elements';

import WaitForLoad from '../wait-for-load.components';
import SubscriptionSidebar from './subscription-sidebar.components';
import SubscriptionCardAndValidation from './subscription-card-and-validation.components';
import withCountry from '../shared/with-country.components';

const GET_SUBSCRIPTION_AND_CARDS = gql`
	query getSubscriptionAndCards {
		user {
			id
			subscription @client {
				id
			}
			cards @client {
				id
				name
				last4
				exp_month
				exp_year
				country
			}
		}
	}
`;

class Subscription extends React.Component {
	state = {
		validCoupon: null,
	};

	handleChangePlan = ({plan, quantity, coupon}) => {
		const {history, location} = this.props;
		const query = new URLSearchParams(location.search);

		if (plan) query.set('plan', plan);
		if (quantity) query.set('quantity', quantity || undefined);
		if (coupon) query.set('coupon', coupon);
		else query.delete('coupon');

		history.replace({
			...location,
			search: query.toString(),
		});
	};

	saveValidCoupon = validCoupon => this.setState({validCoupon});

	render() {
		const {validCoupon} = this.state;
		const {country, location} = this.props;

		const query = new URLSearchParams(location.search);

		if (!query.has('plan')) {
			query.set('plan', 'personal_annual_99');

			return (
				<Redirect
					replace
					to={{
						...this.props.location,
						search: query.toString(),
					}}
				/>
			);
		}
		let percentPrice = 1;

		if (validCoupon && validCoupon.percent_off) {
			percentPrice = (100 - validCoupon.percent_off) / 100;
		}

		return (
			<div className="subscription">
				<div className="account-dashboard-icon is-in-subscription" />
				<div className="account-dashboard-container">
					<SubscriptionSidebar
						plan={query.get('plan')}
						quantity={parseInt(query.get('quantity'), 10)}
						country={country}
						onChangePlan={this.handleChangePlan}
						percentPrice={percentPrice}
					/>
					<div className="subscription-card-and-validation normal">
						<Query query={GET_SUBSCRIPTION_AND_CARDS}>
							{({loading, data: {user}}) => {
								if (loading) {
									return <WaitForLoad loading />;
								}
								if (user.subscription) {
									return <Redirect to="/account/details" />;
								}

								return (
									<Elements>
										<SubscriptionCardAndValidation
											cards={user.cards}
											plan={query.get('plan')}
											quantity={parseInt(query.get('quantity'), 10)}
											coupon={query.get('coupon')}
											country={country}
											onChangePlan={this.handleChangePlan}
											onSelectCoupon={this.saveValidCoupon}
										/>
									</Elements>
								);
							}}
						</Query>
					</div>
				</div>
			</div>
		);
	}
}

Subscription.propTypes = {
	location: PropTypes.object.isRequired,
	country: PropTypes.string.isRequired,
};

export default withRouter(withCountry(Subscription));
