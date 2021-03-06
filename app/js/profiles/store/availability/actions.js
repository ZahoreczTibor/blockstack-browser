import * as types from './types'

import log4js from 'log4js'

import {
  isNameAvailable, getNamePrices
} from '../../../utils/index'

const logger = log4js.getLogger('profiles/store/availability/actions.js')

function checkingNameAvailability(domainName) {
  return {
    type: types.CHECKING_NAME_AVAILABILITY,
    domainName
  }
}

function nameAvailable(domainName) {
  return {
    type: types.NAME_AVAILABLE,
    domainName
  }
}

function nameUnavailable(domainName) {
  return {
    type: types.NAME_UNAVAILABLE,
    domainName
  }
}

function nameAvailabilityError(domainName, error) {
  return {
    type: types.NAME_AVAILABILITIY_ERROR,
    domainName,
    error
  }
}

function checkingNamePrice(domainName) {
  return {
    type: types.CHECKING_NAME_PRICE,
    domainName
  }
}

function namePrice(domainName, price) {
  return {
    type: types.NAME_PRICE,
    domainName,
    price
  }
}

function namePriceError(domainName, error) {
  return {
    type: types.NAME_PRICE_ERROR,
    domainName,
    error
  }
}

function checkNameAvailabilityAndPrice(api, domainName) {
  logger.trace(`checkNameAvailabilityAndPrice: ${domainName}`)
  return dispatch => {
    dispatch(checkingNameAvailability(domainName))

    return isNameAvailable(api.nameLookupUrl, domainName).then((isAvailable) => {
      if (isAvailable) {
        dispatch(nameAvailable(domainName))
        dispatch(checkingNamePrice(domainName))
        return getNamePrices(api.priceUrl, domainName).then((prices) => {
          const price = prices.total_estimated_cost.btc
          dispatch(namePrice(domainName, price))
        }).catch((error) => {
          logger.error('checkNameAvailabilityAndPrice: getNamePrices: error', error)
          dispatch(namePriceError(domainName, error))
        })
      } else {
        dispatch(nameUnavailable(domainName))
      }
    }).catch((error) => {
      logger.error('checkNameAvailabilityAndPrice: isNameAvailable: error', error)
      dispatch(nameAvailabilityError(domainName, error))
    })
  }
}

const AvailabilityActions = {
  checkingNameAvailability,
  nameAvailable,
  nameUnavailable,
  nameAvailabilityError,
  checkingNamePrice,
  namePrice,
  namePriceError,
  checkNameAvailabilityAndPrice
}

export default AvailabilityActions
