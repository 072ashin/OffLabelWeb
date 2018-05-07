function [F, J] = distance2plane(x, P)
% Calculate signed distance of each point in each point of P to the plane
% parameterized by x = (rho, phi, zeta)
% Input:
%       x : tuple of 3 real numbers (rho, phi, zeta) describing the plane
%       P : n queries of 3-D points of size n x 3 where P(i, :) is the
%       coordinates of the i-th point
% Output:
%       F is of size n x 1 is the modified signed distances corresponding
%       to each point in P
%       J is of size n x 3 is the Jacobian of F with respect to x
    rho = x(1); phi = x(2); zeta = x(3);
    n = [cos(phi) * sin(zeta), sin(phi) * sin(zeta), cos(zeta)];
    F = P * n' + repmat(rho, size(P, 1), 1);
    J = zeros(size(P, 1), 3);
    n_phi = [-sin(phi) * sin(zeta), cos(phi) * sin(zeta), 0];
    n_zeta = [cos(phi) * cos(zeta), sin(phi) * cos(zeta), -sin(zeta)];
    J(:, 1) = 1;
    J(:, 2) = P * n_phi';
    J(:, 3) = P * n_zeta';
end
