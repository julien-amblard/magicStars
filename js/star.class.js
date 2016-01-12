var Stars = function( settings ){

	this.focus = false;
	this.mouse = {
		x : 0,
		y : 0
	};
	this.stars = [];
	this.canvas;
	this.ctx;


	this.img 		= settings.pattern;
	this.c 			= settings.container;
	this.id 		= ( settings.id )? settings.id : 'stars' ;
	this.life 		= ( settings.life )? settings.life : 5 ;
	this.w 			= ( settings.width )? settings.width : this.img.width ;
	this.pop 		= ( settings.popDist )? settings.popDist : 2 ;
	this.speed 		= ( settings.speed )? settings.speed : 5 ;
	this.gravity	= ( settings.gravity != 'undefined' )? settings.gravity : 2 ;

	this.init();

}

Stars.prototype.init = function()
{	
	this.bindClick();
	this.buildScene();
	this.start();
};

Stars.prototype.rand = function( min, max ){ return Math.random() * ( max - min) + min; };

Stars.prototype.buildScene = function()
{

	this.canvas 		= document.createElement('canvas');
	this.canvas.id 		= this.id;
	this.canvas.width 	= this.c.clientWidth;
	this.canvas.height 	= this.c.clientHeight;
	this.ctx 			= this.canvas.getContext('2d');

	this.c.appendChild( this.canvas );

	this.res = this.resize.bind(this);
	this.c.addEventListener( 'resize', this.res );

};


Stars.prototype.resize = function()
{

	this.canvas.width 	= this.c.clientWidth;
	this.canvas.height 	= this.c.clientHeight;

};

Stars.prototype.bindClick = function()
{

	this.bindmove = this.bindMove.bind( this );
	this.c.addEventListener('mousedown', this.bindmove );

};



Stars.prototype.bindMove = function()
{

	this.add = this.addStar.bind( this );
	this.c.addEventListener('mousemove', this.add );
	this.stop = this.unbindMove.bind( this );
	document.body.addEventListener('mouseup', this.stop );

	this.focus = true;

};

Stars.prototype.unbindMove = function()
{
	
	this.c.removeEventListener('mousemove', this.add);
	document.body.removeEventListener('mouseup', this.stop);

	this.focus = false;

};


Stars.prototype.getMouseVars = function()
{

	this.mouse.y 			= event.layerY; 
	this.mouse.x 			= event.layerX; 

};

Stars.prototype.buildStar = function()
{

	return {

		x : this.rand( this.mouse.x - this.pop, this.mouse.x + this.pop ),
		y : this.rand( this.mouse.y - this.pop, this.mouse.y + this.pop ),
		r : this.rand( 0, 360 ),
		w : this.rand( this.w / 3, this.w ),
		a : this.rand( 0, 1.3),
		vx : this.rand( -this.speed, this.speed ),
		vy : this.rand( -this.speed, this.speed ),
		vr : this.rand( -(this.speed*10), (this.speed*10) ),
		life : this.rand( this.life / 2, this.life ),
		update : this.rand( 0, 1 )

	};

}

Stars.prototype.addStar = function()
{

	this.getMouseVars();

	if( this.focus ) {
		
		this.stars.push( this.buildStar() );
		this.stars.push( this.buildStar() );
		this.stars.push( this.buildStar() );
		this.stars.push( this.buildStar() );
		this.stars.push( this.buildStar() );

	}

};




Stars.prototype.update = function() {

	for (var i = this.stars.length - 1; i >= 0; i--) {

		this.stars[i].x 	+= this.stars[i].vx;
		this.stars[i].y 	+= this.stars[i].vy;
		this.stars[i].vy 	+= this.gravity / 10;
		this.stars[i].vx 	+= this.gravity / 100;

		if( this.stars[i].life < 0 || this.stars[i].y > this.canvas.height ){

			this.stars[i].a -= 0.06;
			this.stars[i].r += this.stars[i].vr;

			if( this.stars[i].a < 0 )
				this.stars.splice( i, 1 );		

		}else{

			if( this.stars[i].update <= 0 ){
			
				this.stars[i].w 		= this.rand( this.w / 3, this.w );
				this.stars[i].a 		= this.rand( 0.6, 1.3);
				this.stars[i].r 		= this.rand( 0, 360);
				this.stars[i].vr 		= this.rand( -(this.speed*10), (this.speed*10));
				this.stars[i].update 	= this.rand( -1, 1);
				
			}else{

				this.stars[i].update -= 0.1;

			}

			this.stars[i].r += this.stars[i].vr;

			this.stars[i].life -= 0.1;

		}

		

	};

};

Stars.prototype.draw = function() {	

	this.ctx.clearRect( 0, 0, this.canvas.width, this.canvas.height);

	this.ctx.globalCompositeOperation = "lighter";

	for (var i = this.stars.length - 1; i >= 0; i--) {
		
		var star = this.stars[i];

		this.ctx.save();

		this.ctx.translate( star.x - ( star.w / 2 ), star.y - ( star.w / 2 ) );
		this.ctx.rotate( star.r * Math.PI / 180 );
		this.ctx.globalAlpha = star.a;
		

		this.ctx.drawImage( 
			this.img, 				//Specifies the image, canvas, or video element to use
			0, 						//The x coordinate where to start clipping
			0, 						//The y coordinate where to start clipping
			this.img.width, 		//The width of the clipped image
			this.img.height, 		//The height of the clipped image
			0, 						//The x coordinate where to place the image on the canvas
			0, 						//The y coordinate where to place the image on the canvas
			star.w, 				//The width of the image to use (stretch or reduce the image)
			star.w  				//The height of the image to use (stretch or reduce the image)
		);
		
		this.ctx.restore();

	};

	this.ctx.globalCompositeOperation = "source-over";

};









Stars.prototype.start = function()
{

	this.running = true;
	this.run();

}
Stars.prototype.stop = function()
{

	this.running = false;

};

Stars.prototype.run = function()
{
	this.update();
	this.draw();
	loop = this.run.bind( this );
	if( this.running )
		requestAnimationFrame( loop );
}

