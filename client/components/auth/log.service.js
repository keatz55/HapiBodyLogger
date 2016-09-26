'use strict';

export function LogResource($resource) {
  'ngInject';

  return $resource('/api/logs/:id/:controller', {
    id: '@_id'
  },{
  	'get': {method:'GET', isArray:true},
  	'update': {method:'PUT'}
  });
}
