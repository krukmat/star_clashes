
    //  Our core Bullet class
    //  This is a simple Sprite object that we set a few properties on
    //  It is fired by all of the Weapon classes

    var Bullet = function (game, key) {

        Phaser.Sprite.call(this, game, 0, 0, key);

        this.texture.baseTexture.scaleMode = PIXI.scaleModes.NEAREST;

        this.anchor.set(0.5);

        this.checkWorldBounds = true;
        this.enableBody = true;
        this.outOfBoundsKill = true;
        this.exists = false;

        this.tracking = false;
        this.scaleSpeed = 0;

    };

    Bullet.prototype = Object.create(Phaser.Sprite.prototype);
    Bullet.prototype.constructor = Bullet;

    Bullet.prototype.fire = function (x, y, angle, speed, gx, gy) {

        gx = gx || 0;
        gy = gy || 0;

        this.reset(x, y);
        this.scale.set(1);

        this.game.physics.arcade.velocityFromAngle(angle, speed, this.body.velocity);

        this.angle = angle;

        this.body.gravity.set(gx, gy);

    };

    Bullet.prototype.update = function () {

        if (this.tracking)
        {
            this.rotation = Math.atan2(this.body.velocity.y, this.body.velocity.x);
        }

        if (this.scaleSpeed > 0)
        {
            this.scale.x += this.scaleSpeed;
            this.scale.y += this.scaleSpeed;
        }

    };

    var Weapon = {};

    ////////////////////////////////////////////////////
    //  A single bullet is fired in front of the ship //
    ////////////////////////////////////////////////////

    Weapon.SingleBullet = function (game) {

        Phaser.Group.call(this, game, game.world, 'Single Bullet', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;
        this.enableBody = true;
        this.weaponOrdering = [-90, -45, 0, -315, -270, -225, -180, -135];
        this.damageRate = 3;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet5'), true);
        }

        return this;

    };

    Weapon.SingleBullet.prototype = Object.create(Phaser.Group.prototype);
    Weapon.SingleBullet.prototype.constructor = Weapon.SingleBullet;

    Weapon.SingleBullet.prototype.fire = function (source, angle) {

        if (this.game.time.time < this.nextFire) { return; }

        var x = source.x + 10;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;

    };

    /////////////////////////////////////////////////////////
    //  A bullet is shot both in front and behind the ship //
    /////////////////////////////////////////////////////////

    Weapon.FrontAndBack = function (game) {

        Phaser.Group.call(this, game, game.world, 'Front And Back', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet5'), true);
        }

        return this;

    };

    Weapon.FrontAndBack.prototype = Object.create(Phaser.Group.prototype);
    Weapon.FrontAndBack.prototype.constructor = Weapon.FrontAndBack;

    Weapon.FrontAndBack.prototype.fire = function (source) {

        if (this.game.time.time < this.nextFire) { return; }

        var x = source.x + 10;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;

    };

    //////////////////////////////////////////////////////
    //  3-way Fire (directly above, below and in front) //
    //////////////////////////////////////////////////////

    Weapon.ThreeWay = function (game) {

        Phaser.Group.call(this, game, game.world, 'Three Way', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;

        for (var i = 0; i < 96; i++)
        {
            this.add(new Bullet(game, 'bullet7'), true);
        }

        return this;

    };

    Weapon.ThreeWay.prototype = Object.create(Phaser.Group.prototype);
    Weapon.ThreeWay.prototype.constructor = Weapon.ThreeWay;

    Weapon.ThreeWay.prototype.fire = function (source) {

        if (this.game.time.time < this.nextFire) { return; }

        var x = source.x + 10;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;

    };

    /////////////////////////////////////////////
    //  8-way fire, from all sides of the ship //
    /////////////////////////////////////////////

    Weapon.EightWay = function (game) {

        Phaser.Group.call(this, game, game.world, 'Eight Way', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 100;

        for (var i = 0; i < 96; i++)
        {
            this.add(new Bullet(game, 'bullet5'), true);
        }

        return this;

    };

    Weapon.EightWay.prototype = Object.create(Phaser.Group.prototype);
    Weapon.EightWay.prototype.constructor = Weapon.EightWay;

    Weapon.EightWay.prototype.fire = function (source) {

        if (this.game.time.time < this.nextFire) { return; }

        var x = source.x + 16;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, 0, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 45, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 90, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 135, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 180, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 225, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 270, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, 315, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;

    };

    ////////////////////////////////////////////////////
    //  Bullets are fired out scattered on the y axis //
    ////////////////////////////////////////////////////

    Weapon.ScatterShot = function (game) {

        Phaser.Group.call(this, game, game.world, 'Scatter Shot', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 40;

        for (var i = 0; i < 32; i++)
        {
            this.add(new Bullet(game, 'bullet5'), true);
        }

        return this;

    };

    Weapon.ScatterShot.prototype = Object.create(Phaser.Group.prototype);
    Weapon.ScatterShot.prototype.constructor = Weapon.ScatterShot;

    Weapon.ScatterShot.prototype.fire = function (source, angle) {

        if (this.game.time.time < this.nextFire) { return; }

        var x = source.x + 16;
        var y = (source.y + source.height / 2) + this.game.rnd.between(-10, 10);

        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;

    };

    //////////////////////////////////////////////////////////////////////////
    //  Fires a streaming beam of lazers, very fast, in front of the player //
    //////////////////////////////////////////////////////////////////////////

    Weapon.Beam = function (game) {

        Phaser.Group.call(this, game, game.world, 'Beam', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 1000;
        this.fireRate = 45;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet11'), true);
        }

        return this;

    };

    Weapon.Beam.prototype = Object.create(Phaser.Group.prototype);
    Weapon.Beam.prototype.constructor = Weapon.Beam;

    Weapon.Beam.prototype.fire = function (source, angle) {

        if (this.game.time.time < this.nextFire) { return; }

        var x = source.x + 40;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;

    };

    ///////////////////////////////////////////////////////////////////////
    //  A three-way fire where the top and bottom bullets bend on a path //
    ///////////////////////////////////////////////////////////////////////

    Weapon.SplitShot = function (game) {

        Phaser.Group.call(this, game, game.world, 'Split Shot', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 700;
        this.fireRate = 40;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet8'), true);
        }

        return this;

    };

    Weapon.SplitShot.prototype = Object.create(Phaser.Group.prototype);
    Weapon.SplitShot.prototype.constructor = Weapon.SplitShot;

    Weapon.SplitShot.prototype.fire = function (source, angle) {

        if (this.game.time.time < this.nextFire) { return; }

        var x = source.x + 20;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, -500);
        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);
        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 500);

        this.nextFire = this.game.time.time + this.fireRate;

    };

    ///////////////////////////////////////////////////////////////////////
    //  Bullets have Gravity.y set on a repeating pre-calculated pattern //
    ///////////////////////////////////////////////////////////////////////

    Weapon.Pattern = function (game) {

        Phaser.Group.call(this, game, game.world, 'Pattern', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 600;
        this.fireRate = 40;

        this.pattern = Phaser.ArrayUtils.numberArrayStep(-800, 800, 200);
        this.pattern = this.pattern.concat(Phaser.ArrayUtils.numberArrayStep(800, -800, -200));

        this.patternIndex = 0;

        for (var i = 0; i < 64; i++)
        {
            this.add(new Bullet(game, 'bullet4'), true);
        }

        return this;

    };

    Weapon.Pattern.prototype = Object.create(Phaser.Group.prototype);
    Weapon.Pattern.prototype.constructor = Weapon.Pattern;

    Weapon.Pattern.prototype.fire = function (source, angle) {

        if (this.game.time.time < this.nextFire) { return; }

        var x = source.x + 20;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, this.pattern[this.patternIndex]);

        this.patternIndex++;

        if (this.patternIndex === this.pattern.length)
        {
            this.patternIndex = 0;
        }

        this.nextFire = this.game.time.time + this.fireRate;

    };

    ///////////////////////////////////////////////////////////////////
    //  Rockets that visually track the direction they're heading in //
    ///////////////////////////////////////////////////////////////////

    Weapon.Rockets = function (game) {

       this.weaponOrdering = [180, -135, -90, -45, 0, -315, -270, -225];

        Phaser.Group.call(this, game, game.world, 'Rockets', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 400;
        this.fireRate = 250;
        this.damageRate = 10;

        for (var i = 0; i < 32; i++)
        {
            this.add(new Bullet(game, 'bullet10'), true);
        }

        this.setAll('tracking', true);

        return this;

    };

    Weapon.Rockets.prototype = Object.create(Phaser.Group.prototype);
    Weapon.Rockets.prototype.constructor = Weapon.Rockets;

    Weapon.Rockets.prototype.fire = function (source, angle) {

        if (this.game.time.time < this.nextFire) { return; }
        //console.log(source.animations);
        var x = source.x + 10;
        var y = source.y + 10;
        //var z = source.z + 10;
        //var x = source.x + source.animations.currentAnim.currentFrame.x;
        //var y = source.y + source.animations.currentAnim.currentFrame.y;

        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;

    };

    ////////////////////////////////////////////////////////////////////////
    //  A single bullet that scales in size as it moves across the screen //
    ////////////////////////////////////////////////////////////////////////

    Weapon.ScaleBullet = function (game) {

        Phaser.Group.call(this, game, game.world, 'Scale Bullet', false, true, Phaser.Physics.ARCADE);

        this.nextFire = 0;
        this.bulletSpeed = 800;
        this.fireRate = 100;

        for (var i = 0; i < 32; i++)
        {
            this.add(new Bullet(game, 'bullet9'), true);
        }

        this.setAll('scaleSpeed', 0.05);

        return this;

    };

    Weapon.ScaleBullet.prototype = Object.create(Phaser.Group.prototype);
    Weapon.ScaleBullet.prototype.constructor = Weapon.ScaleBullet;

    Weapon.ScaleBullet.prototype.fire = function (source, angle) {

        if (this.game.time.time < this.nextFire) { return; }

        var x = source.x + 10;
        var y = source.y + 10;

        this.getFirstExists(false).fire(x, y, angle, this.bulletSpeed, 0, 0);

        this.nextFire = this.game.time.time + this.fireRate;

    };