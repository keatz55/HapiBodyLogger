'use strict';

export function FoodEntryResource($resource) {
  'ngInject';

  return $resource('/api/food-entries/:id/:controller', {
    id: '@_id'
  },{
  	'update': {method:'PUT'}
  });
}
