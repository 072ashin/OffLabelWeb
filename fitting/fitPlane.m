function [x, y, z, nx, ny, nz] = fitPlane(P, x, y, z, nx, ny, nz)
% Fit a plane to n 3D-points in P given the initial estimate of it
% Input: P, x, y, z, nx, ny, nz
%       P : list of 3-D points, is of size n x 3, P(i, :) is the coordinates
%       of the i-th point
%       x, y, z : a point on the plane
%       nx, ny, nz : the normal vector of the plane
% Output: x, y, z, nx, ny, nz where [nx, ny, nz] is the plane normal vector
% and [x, y, z] is a representative point on that plane
    phi = atan2(ny, nx);
    zeta = acos(nz / sqrt(nx^2 + ny^2 + nz^2));
    rho = -dot([x y z], [cos(phi) * sin(zeta), sin(phi) * sin(zeta), cos(zeta)]);
    options = optimset('Jacobian', 'on', 'Algorithm','trust-region-reflective', 'display', 'off');
    out = lsqnonlin(@(x)distance2plane(x, P), [rho, phi, zeta], [-Inf -pi 0], [Inf pi pi], options);
    nx = cos(out(2)) * sin(out(3));
    ny = sin(out(2)) * sin(out(3));
    nz = cos(out(3));
	x = mean(P(:, 1));
	y = mean(P(:, 2));
	z = mean(P(:, 3));
end
