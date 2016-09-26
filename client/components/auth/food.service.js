'use strict';

export function FoodResource($resource) {
  'ngInject';

  return $resource('/api/food/:id/:controller', {
    id: '@_id'
  },{
  	'update': {method:'PUT'}
  });
}
