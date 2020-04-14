const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;
const Clutter = imports.gi.Clutter;
const Meta = imports.gi.Meta;
const Lang = imports.lang;

let activities;
let button;


const ActivitiesIcons = new Lang.Class({
    Name: 'ActivitiesIcons',
    Extends: PanelMenu.Button,

    _init()
    {
        this.parent(0.0, null, true);

        this.wm = global.workspace_manager;

        this.box = new St.BoxLayout({style_class: 'activity-box'});

        this.appButton = new St.Button();
        this.appIcon = new St.Icon({icon_name: 'view-app-grid-symbolic', style_class: 'activity-icon'});
        this.appButton.add_actor(this.appIcon);
        this.appButton.connect('clicked', () => this._changePage(true));
        this.appButton.connect('scroll-event', (actor, event) => this._scrollWindows(actor, event));
        this.box.add_actor(this.appButton);

        this.overButton = new St.Button();
        this.overIcon = new St.Icon({icon_name: 'focus-windows-symbolic', style_class: 'activity-icon'});
        this.overButton.add_actor(this.overIcon);
        this.overButton.connect('clicked', () => this._changePage(false));
        this.overButton.connect('scroll-event', (actor, event) => this._scrollWorkspace(actor, event));
        this.box.add_actor(this.overButton);

        this.actor.add_child(this.box);
    },

    destroy()
    {
        this.parent();
    },

    _changePage(appsButtonChecked)
    {
        // selecting the same view again will hide the overview
        if (Main.overview.visible && appsButtonChecked == Main.overview.viewSelector._showAppsButton.checked)
        {
            Main.overview.hide();
            return;
        }

        Main.overview.viewSelector._showAppsButton.checked = appsButtonChecked;

        if (!Main.overview.visible)
            Main.overview.show();
        else
            Main.overview.viewSelector._showAppsButtonToggled();
    },

    _scrollWindows(actor, event)
    {
        let workspace = this.wm.get_active_workspace();
        let windows = global.display.get_tab_list(Meta.TabList.NORMAL_ALL, workspace);
        if (windows.length < 2)
            return;

        switch (event.get_scroll_direction())
        {
          case Clutter.ScrollDirection.UP:
            windows[windows.length - 1].activate(global.get_current_time());
            break;
          case Clutter.ScrollDirection.DOWN:
            windows[windows.length - windows.length > 2 ? 2 : 1].activate(global.get_current_time());
            //windows[0].lower(); // the windows loses focus using this method
            break;
        }

        return Clutter.EVENT_STOP;
    },

    _scrollWorkspace(actor, event)
    {
        let workspace = this.wm.get_active_workspace();

        switch (event.get_scroll_direction())
        {
          case Clutter.ScrollDirection.UP:
            if (workspace.index() == 0)
                return;
            else
                workspace.get_neighbor(Meta.MotionDirection.UP).activate(global.get_current_time());
            break;
          case Clutter.ScrollDirection.DOWN:
            if (workspace.index() + 1 == this.wm.n_workspaces)
                return;
            else
                workspace.get_neighbor(Meta.MotionDirection.DOWN).activate(global.get_current_time());
            break;
        }

        return Clutter.EVENT_STOP;
    }
});

function init()
{
    activities = Main.panel.statusArea['activities'];
}

function enable()
{
    button = new ActivitiesIcons();

    activities.container.hide();
    Main.panel.addToStatusArea('activitiesicons', button, 0, 'left');
}

function disable()
{
    button.destroy();
    activities.container.show();
}
