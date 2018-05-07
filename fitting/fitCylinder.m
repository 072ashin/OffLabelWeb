function [dx, dy, dz, px, py, pz, r] = fitCylinder(P, dx, dy, dz, px, py, pz, r)
% Fit the cylinder to n 3D-points in P given the initial estimate of the cylinder
% Input: P, dx, dy, dz, px, py, pz, r
%     P : list of 3D-points, is of size n * 3
%     dx dy dz : vector indicates the axis of the cylinder
%     px py pz : a point on the rotational axis of the cylinder
%     r : the radius of the cylinder
% Output: dx dy dz px py pz r
    k = 1/r;
    t = dot([dx dy dz], [-px -py -pz]) / norm([dx dy dz]);
    x = px + t * dx; y = py + t * dy; z = pz + t * dz;
    rho = sqrt(x^2 + y^2 + z^2) - r;
    phi = atan2(y, x);
    zeta = acos(z / sqrt(x^2 + y^2 + z^2));
    n_zeta = [cos(phi) * cos(zeta), sin(phi) * cos(zeta), -sin(zeta)];
    n_phi_bar = [-sin(phi), cos(phi), 0];
    cos_alpha = dot([dx dy dz], n_zeta) / norm([dx dy dz]);
    sin_alpha = dot([dx dy dz], n_phi_bar) / norm([dx dy dz]);
    alpha = acos(cos_alpha) * sign(sin_alpha);
    alpha = max(alpha, -pi);
    alpha = min(alpha, pi);
    options = optimset('Jacobian', 'on', 'Algorithm', 'trust-region-reflective', 'display', 'off');
    out = lsqnonlin(@(x)distance2cylinder(x, P), [rho phi zeta alpha k], [-Inf -pi 0 -pi 0], [Inf pi pi pi Inf], options);
    r = 1/out(5);
    px = (out(1) + r) * cos(out(2)) * sin(out(3));
    py = (out(1) + r) * sin(out(2)) * sin(out(3));
    pz = (out(1) + r) * cos(out(3));
    dx = cos(out(2)) * cos(out(3)) * cos(out(4)) - sin(out(2)) * sin(out(4));
    dy = sin(out(2)) * cos(out(3)) * cos(out(4)) + cos(out(2)) * sin(out(4));
    dz = -sin(out(3)) * cos(out(4));
end
