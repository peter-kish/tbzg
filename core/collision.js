// Circle-rectangle collision
function CRCollision(cx, cy, cr, rx, ry, rw, rh) {
	var cdx = Math.abs(cx - (rx+rw/2));
    var cdy = Math.abs(cy - (ry+rh/2));

    if (cdx > (rw/2 + cr)) { return false; }
    if (cdy > (rh/2 + cr)) { return false; }

    if (cdx <= (rw/2)) { return true; }
    if (cdy <= (rh/2)) { return true; }

    var cornerDistance_sq = Math.pow((cdx - rw/2), 2) +
                         Math.pow((cdy - rh/2), 2);

    return (cornerDistance_sq <= (Math.pow(cr, 2)));
}

function pointInRect(px, py, rx, ry, rw, rh) {
	if ((px >= rx) && (px <= rx + rw) && (py >= ry) && (py <= ry + rh))
	{
		return true;
	}
	return false;
}

function sameSigns( a, b )	{
		return (a < 0 && b < 0) || (a >= 0 && b >= 0);
}

function linesIntersect(l1p1, l1p2, l2p1, l2p2)
{
  var a1, a2, b1, b2, c1, c2; /* Coefficients of line eqns. */
  var r1, r2, r3, r4;         /* 'Sign' values */
  var denom, offset, num;     /* Intermediate values */

  /* Compute a1, b1, c1, where line joining points 1 and 2
   * is "a1 x  +  b1 y  +  c1  =  0". */
  a1 = l1p2.y - l1p1.y;
  b1 = l1p1.x - l1p2.x;
  c1 = l1p2.x * l1p1.y - l1p1.x * l1p2.y;

  /* Compute r3 and r4. */
  r3 = a1 * l2p1.x + b1 * l2p1.y + c1;
  r4 = a1 * l2p2.x + b1 * l2p2.y + c1;

  /* Check signs of r3 and r4.  If both point 3 and point 4 lie on
   * same side of line 1, the line segments do not intersect. */
  if ( r3 != 0 &&
       r4 != 0 &&
       sameSigns( r3, r4 ))
      return null;

  /* Compute a2, b2, c2 */
  a2 = l2p2.y - l2p1.y;
  b2 = l2p1.x - l2p2.x;
  c2 = l2p2.x * l2p1.y - l2p1.x * l2p2.y;

  /* Compute r1 and r2 */
  r1 = a2 * l1p1.x + b2 * l1p1.y + c2;
  r2 = a2 * l1p2.x + b2 * l1p2.y + c2;

  /* Check signs of r1 and r2.  If both point 1 and point 2 lie
   * on same side of second line segment, the line segments do
   * not intersect.
   */
  if ( r1 != 0 &&
       r2 != 0 &&
       sameSigns( r1, r2 ))
      return null;

  /* Line segments intersect: compute intersection point.
   */
  denom = a1 * b2 - a2 * b1;
  if ( denom == 0 )
      return null;
  offset = denom < 0 ? - denom / 2 : denom / 2;

  /* The denom/2 is to get rounding instead of truncating.  It
   * is added or subtracted to the numerator, depending upon the
   * sign of the numerator.
   */
	var result = new Vector2d(0, 0);

  num = b1 * c2 - b2 * c1;
	result.x = ( num < 0 ? num - offset : num + offset ) / denom;

  num = a2 * c1 - a1 * c2;
  result.y = ( num < 0 ? num - offset : num + offset ) / denom;

  return result;
}

function lineIntersectsRect(lp1, lp2, rect) {
	var rlp1 = new Vector2d(rect.x, rect.y);
	var rlp2 = new Vector2d(rect.x + rect.width, rect.y);
	if (linesIntersect(lp1, lp2, rlp1, rlp2) != null)
		return true;

	rlp1 = new Vector2d(rect.x + rect.width, rect.y);
	rlp2 = new Vector2d(rect.x + rect.width, rect.y + rect.height);
	if (linesIntersect(lp1, lp2, rlp1, rlp2) != null)
		return true;

	rlp1 = new Vector2d(rect.x + rect.width, rect.y + rect.height);
	rlp2 = new Vector2d(rect.x, rect.y + rect.height);
	if (linesIntersect(lp1, lp2, rlp1, rlp2) != null)
		return true;

	rlp1 = new Vector2d(rect.x, rect.y + rect.height);
	rlp2 = new Vector2d(rect.x, rect.y);
	if (linesIntersect(lp1, lp2, rlp1, rlp2) != null)
		return true;

	return false;
}
