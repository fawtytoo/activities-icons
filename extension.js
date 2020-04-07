const Main = imports.ui.main;
const Lang = imports.lang;
const PanelMenu = imports.ui.panelMenu;
const St = imports.gi.St;

let activities;
let button;


class ActivitiesIcons extends PanelMenu.Button
{
    _init()
    {
        super._init();

        this.box = new St.BoxLayout({style_class: 'activity-box'});

        this.appButton = new St.Button();
        this.appIcon = new St.Icon({icon_name: 'view-app-grid-symbolic', style_class: 'activity-icon'});
        this.appButton.add_actor(this.appIcon);
        this.appButton.connect('clicked', Lang.bind(this, this._showApplications));
        this.box.add_actor(this.appButton);

        this.overButton = new St.Button();
        this.overIcon = new St.Icon({icon_name: 'focus-windows-symbolic', style_class: 'activity-icon'});
        this.overButton.add_actor(this.overIcon);
        this.overButton.connect('clicked', Lang.bind(this, this._showWorkspaces));
        this.box.add_actor(this.overButton);

        this.actor.add_child(this.box);
    }

    destroy()
    {
        if (super.destroy)
            super.destroy();
    }

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
    }

    _showApplications()
    {
        this._changePage(true);
    }

    _showWorkspaces()
    {
        this._changePage(false);
    }
};

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
