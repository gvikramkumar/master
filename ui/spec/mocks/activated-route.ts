import _ from 'lodash';

export class ActivatedRouteMock {
    snapshot = {
      params: {},
      data: {
        authorization: undefined,
        hero: {
          title: undefined,
          desc: undefined
        },
        breadcrumbs: undefined
      }
    };
  setParams(params) {
    _.set(this.snapshot, 'params', params);
    return this;
  }

  setAuthorization(authorization) {
    _.set(this.snapshot, 'data.authorization', authorization);
    return this;
  }

  setHero(hero) {
    _.set(this.snapshot, 'data.hero', hero);
    return this;
  }

  setBreadcrumbs(breadcrumbs) {
    _.set(this.snapshot, 'data.breadcrumbs', breadcrumbs);
    return this;
  }

}
