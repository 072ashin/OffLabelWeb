function [x, y, z, r] = fitSphere(P, x, y, z, r)
% Fit a sphere to n 3D-points in P given the initial estimate of it
% Input: P, x, y, z, r
%       P : list of 3-D points, is of size n x 3, P(i, :) is the coordinates of the i-th point
%       x, y, z : the center of the sphere
%       r : the radius of the sphere
% Output: x, y, z, r: new sphere's parameters
    nx = x; ny = y; nz = z;
    t = norm([nx, ny, nz]);
    nx = nx / t; ny = ny / t; nz = nz / t;
    phi = atan2(ny, nx);
    zeta = acos(nz / sqrt(nx^2 + ny^2 + nz^2));
    rho = sqrt(x .^ 2 + y .^ 2 + z .^ 2) - r;
    k = 1 / r;
    options = optimset('Jacobian', 'on', 'Algorithm','trust-region-reflective', 'display', 'off');
    out = lsqnonlin(@(x)distance2sphere(x, P), [rho, phi, zeta, k], [-Inf -pi 0 0], [Inf pi pi Inf], options);
    rho = out(1);
    nx = cos(out(2)) * sin(out(3));
    ny = sin(out(2)) * sin(out(3));
    nz = cos(out(3));
    r = 1 / out(4);
    x = (rho + r) * nx;
    y = (rho + r) * ny;
    z = (rho + r) * nz;
end
