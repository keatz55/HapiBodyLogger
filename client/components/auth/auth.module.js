'use strict';

import angular from 'angular';
import constants from '../../app/app.constants';
import util from '../util/util.module';
import ngCookies from 'angular-cookies';
import { authInterceptor } from './interceptor.service';
import { routerDecorator } from './router.decorator';
import { AuthService } from './auth.service';
import { UserResource } from './user.service';
import { LogResource } from './log.service';
import { MealResource } from './meal.service';
import { FoodResource } from './food.service';
import { FoodEntryResource } from './food-entry.service';

import uiRouter from 'angular-ui-router';

function addInterceptor($httpProvider) {
  'ngInject';

  $httpProvider.interceptors.push('authInterceptor');
}

export default angular.module('hapiBodyLoggerApp.auth', [constants, util, ngCookies, uiRouter])
  .factory('authInterceptor', authInterceptor)
  .run(routerDecorator)
  .factory('Auth', AuthService)
  .factory('User', UserResource)
  .factory('Log', LogResource)
  .factory('Meal', MealResource)
  .factory('Food', FoodResource)
  .factory('FoodEntry', FoodEntryResource)
  .config(['$httpProvider', addInterceptor])
  .name;
