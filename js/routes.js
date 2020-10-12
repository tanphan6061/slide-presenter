/**
 * Type: Routes
 * Name: routes
 * Author: PVT
 * Role: routes
 * Version: 1.0.0
 */

const routes = [
    {
        name: 'edit',
        path: '/edit',
        component: EditMode
    },
    {
        name: 'view',
        path: '/view',
        component: ViewMode
    },
    {
        path: '*',
        redirect: '/edit'
    }
]