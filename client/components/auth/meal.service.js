'use strict';

export function MealResource($resource) {
  'ngInject';

  return $resource('/api/meals/:id/:controller', {
    id: '@_id'
  },{
  	'update': {method:'PUT'}
  });
}
