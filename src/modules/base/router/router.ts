// TODO: how to define notFound behavior
// TODO: how to define base route (in route table with empty string?)
// TODO: integrate analytics tracking events, with GA example

import { createElement } from 'lwc';
import Navigo from 'navigo';

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
            output[route.name] = async () =>
                this.setPage(
                    route.tagName ? route.tagName : `route-${route.name}`,
                    route.component
                );
        }
        this.routes = output;
    };
}

interface Route {
    name: string;
    component: any;
    tagName?: string;
}

interface LWCRouterInput {
    targetElement: HTMLElement;
    routeTable: Route[];
}

export { lwcRouter };
