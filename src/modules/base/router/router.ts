// TODO: how to define notFound behavior
// TODO: integrate analytics tracking events, with GA example

import { createElement } from 'lwc';
import Navigo from 'navigo';

const getQueryVariables = (query) => {
    const output = {};

    const queries = query.split('&');

    queries.forEach((item) => {
        const pair = item.split('=');
        if (output[pair[0]]) {
            // looks like we already have this key.
            if (Array.isArray(output[pair[0]])) {
                // it's an array, so just append to it
                output[pair[0]] = [...output[pair[0]], pair[1]];
            } else {
                output[pair[0]] = [output[pair[0]], pair[1]];
            }
        } else {
            output[pair[0]] = pair[1];
        }
    });

    return output;
};

const generateProps = (params, query, route) => {
    const props = {};
    if (query && route.queryMap) {
        const queryVars = getQueryVariables(query);
        route.queryMap.forEach((queryMapItem) => {
            props[queryMapItem.prop] = queryVars[queryMapItem.query];
        });
    }
    if (params && route.paramMap) {
        route.paramMap.forEach((paramMapItem) => {
            props[paramMapItem.prop] = params[paramMapItem.param];
        });
    }

    return props;
};

class lwcRouter {
    targetElement;
    routeTable;
    router;
    routes;

    constructor({ targetElement, routeTable }: LWCRouterInput) {
        this.targetElement = targetElement;
        this.routeTable = routeTable;

        // eslint-disable-next-line no-restricted-globals
        this.router = new Navigo(location.origin, true);
        this.buildRoutes();
        this.router.on(this.routes);
        this.router.notFound(() => {
            this.router.navigate('home');
        });
        this.router.resolve();
    }

    setPage = (tagName, component, props = {}) => {
        const el = createElement(tagName, {
            is: component,
            fallback: false
        });

        Object.assign(el, props);

        // Remove previous components from the container if necessary
        while (this.targetElement.firstChild) {
            this.targetElement.removeChild(this.targetElement.firstChild);
        }

        this.targetElement.appendChild(el);
    };

    buildRoutes = () => {
        const output = {};
        for (const route of this.routeTable) {
            output[route.name] = async (params, query) =>
                this.setPage(
                    route.tagName ? route.tagName : `route-${route.name}`,
                    route.component,
                    generateProps(params, query, route)
                );
        }
        this.routes = output;
    };
}

interface Route {
    name: string; // the route name, like '/home' or '/user/:userid"
    component: any; // will usually be a ProperCase name of the class exported by your LWC
    tagName?: string; // the name you would use in html for your component, including the namespace.  ex: my-kebab-case-component
    queryMap?: [
        // you want to use query parames from the url as LWC properties. ex: /whatever?id=1234
        {
            query: string;
            prop: string;
        }
    ];
    paramMap?: [
        // you want to use url path variables from the url as LWC properties /whatever/:id
        {
            param: string;
            prop: string;
        }
    ];
}

interface LWCRouterInput {
    targetElement: HTMLElement;
    routeTable: Route[];
}

export { lwcRouter, getQueryVariables };
